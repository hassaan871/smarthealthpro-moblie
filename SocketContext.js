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
        const newSocket = io("http://192.168.18.124:5000", {
          query: { userId: userId },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
        });

        newSocket.on("connect", () => {
          newSocket.emit("updateStatus", {
            userId: userId,
            isOnline: true,
            timestamp: new Date(),
          });
          console.log("Connected to the socket server");
          setError(null);
        });

        newSocket.on("connect_error", (err) => {
          console.error("Connection error: ", err);
          setError("Failed to connect to the server");
        });

        newSocket.on("disconnect", (reason) => {
          newSocket.emit("updateStatus", {
            userId: userId,
            isOnline: false,
            timestamp: new Date(),
          });

          console.warn("Disconnected from the socket server: ", reason);
        });

        newSocket.on("reconnect_attempt", () => {
          console.log("Attempting to reconnect...");
        });

        newSocket.on("heartbeat", () => {
          newSocket.emit("heartbeat_response");
        });

        newSocket.on("userStatus", (data) => {
          console.log("User status update:", data);
        });

        newSocket.on("userTyping", (data) => {
          console.log("User typing update:", data);
        });

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

  // Add this heartbeat response setup
  useEffect(() => {
    if (socket) {
      const heartbeatInterval = setInterval(() => {
        socket.emit("heartbeat_response");
      }, 30000);

      return () => clearInterval(heartbeatInterval);
    }
  }, [socket]);

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
