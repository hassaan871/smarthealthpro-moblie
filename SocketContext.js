import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  const connectSocket = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem("userToken");
      if (userId) {
        const newSocket = io("http://10.135.89.29:5000", {
          query: { userId: userId },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on("connect", () => {
          console.log("Connected to the socket server");
          setError(null);
        });

        newSocket.on("connect_error", (err) => {
          console.error("Connection error: ", err);
          setError("Failed to connect to the server");
        });

        newSocket.on("disconnect", (reason) => {
          console.warn("Disconnected from the socket server: ", reason);
        });

        newSocket.on("reconnect_attempt", () => {
          console.log("Attempting to reconnect...");
        });

        // Add more socket event listeners here as needed

        setSocket(newSocket);
      } else {
        console.warn("No userToken found in AsyncStorage");
        setError("No user token found. Unable to connect to the server.");
      }
    } catch (err) {
      console.error("Error initializing socket: ", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        console.log("Socket connection closed");
        socket.close();
      }
    };
  }, [connectSocket]);

  const value = {
    socket,
    error,
    connectSocket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
