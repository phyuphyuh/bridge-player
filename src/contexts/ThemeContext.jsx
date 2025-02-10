import React, { createContext, useContext, useState } from "react";
import "./ThemeContext.scss";

const initialTheme = {
  className: "theme-default",
}

const themes = {
  "1989": { className: "theme-1989" },
  "folklore": { className: "theme-folklore" },
  "evermore": { className: "theme-evermore" },
  "Red": { className: "theme-red" },
  "Speak Now": { className: "theme-speaknow" },
  "The Tortured Poets Department": { className: "theme-ttpd" },
  "Midnights": { className: "theme-midnights" },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialTheme);

  const changeTheme = (album) => {
    setTheme(themes[album] || initialTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
