import { useEffect, useState } from "react";

const useDarkMode = () => {
  const [currentMode, setCurrentMode] = useState("");
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setCurrentMode("dark");
    } else {
      setCurrentMode("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      setCurrentMode("light");
      return localStorage.setItem("theme", "light");
    }
    document.documentElement.classList.add("dark");
    setCurrentMode("dark");
    localStorage.setItem("theme", "dark");
  };
  return { toggleMode, currentMode };
};
export default useDarkMode;
