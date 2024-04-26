import React, { createContext, useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Context = createContext();

export const MyContextProvider = ({ children }) => {
  const theme = useTheme();
  const [fontWeightOfBookRead, setFontWeightOfBookRead] = useState(100);
  const [fontSizeOfBookRead, setFontSizeOfBookRead] = useState(16);
  const [backgroundColorBookRead, setBackgroundColorOfBookRead] = useState(theme.colors.background);
  const [textColor, setTextColor] = useState(theme.colors.onBackground);
  const [badgeCount, setBadgeCount] = useState(0);

  const updateBadgeCount = (newCount) => {
    setBadgeCount(newCount);
  };

  useEffect(() => {
    setBackgroundColorOfBookRead(theme.colors.background);
    setTextColor(theme.colors.onBackground);
  }, [theme]);

  return (
    <Context.Provider
      value={{
        fontSizeOfBookRead,
        fontWeightOfBookRead,
        backgroundColorBookRead,
        setFontWeightOfBookRead,
        setFontSizeOfBookRead,
        setBackgroundColorOfBookRead,
        textColor,
        setTextColor,
        badgeCount,
        updateBadgeCount,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Context;
