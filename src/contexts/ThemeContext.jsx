import React, { createContext, useContext, useState } from "react";
import "./ThemeContext.scss";

const initialTheme = {
  backgroundColor: "#F9F7F3",
}

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);

  const changeTheme = (album) => {
    if (album === "1989") {
      setTheme({
        className: "theme-1989",
      });
    } else if (album === "folklore") {
      setTheme({
        className: "theme-folklore",
      });
    } else if (album === "evermore") {
      setTheme({
        className: "theme-evermore",
      });
    } else if (album === "Red") {
      setTheme({
        className: "theme-red",
      });
    } else if (album === "Speak Now") {
      setTheme({
        className: "theme-speaknow",
      });
    } else if (album === "The Tortured Poets Department") {
      setTheme({
        className: "theme-ttpd",
      });
    } else if (album === "Midnights") {
      setTheme({
        className: "theme-midnights",
      });
    } else {
      setTheme(initialTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
