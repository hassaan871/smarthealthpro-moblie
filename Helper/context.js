import React, { createContext, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Context = createContext();

export const MyContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [emailGlobal, setEmailGlobal] = useState("");
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [id, setId] = useState(null);

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        userName,
        setUserName,
        emailGlobal,
        setEmailGlobal,
        image,
        setImage,
        avatar,
        setAvatar,
        id,
        setId,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Context;
