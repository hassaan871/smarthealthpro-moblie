import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const userId = await AsyncStorage.getItem("userToken");

        if (userId) {
          const socket = io("http://10.135.10.3:5000", {
            query: { userId: userId },
          });

          socket.on("connect", () => {
            console.log("Connected to the socket server");
          });

          socket.on("connect_error", (err) => {
            console.error("Connection error: ", err);
            setError("Failed to connect to the server");
          });

          socket.on("disconnect", (reason) => {
            console.warn("Disconnected from the socket server: ", reason);
          });

          socket.on("reconnect_attempt", () => {
            console.log("Attempting to reconnect...");
          });

          // Add more socket event listeners here as needed

          setSocket(socket);

          // Cleanup on unmount
          return () => {
            console.log("Socket connection closed");
            socket.close();
          };
        } else {
          console.warn("No userToken found in AsyncStorage");
          setError("No user token found. Unable to connect to the server.");
        }
      } catch (err) {
        console.error("Error initializing socket: ", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    };

    initializeSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, error }}>
      {children}
    </SocketContext.Provider>
  );
};
