import React, { createContext, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Context = createContext();

export const MyContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
 

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Context;
