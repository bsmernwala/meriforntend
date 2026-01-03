import React, { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.body.classList.toggle("dark", !isDark);
    localStorage.setItem("theme", newTheme);
  };

  return (
    // <button className="theme-toggle-btn" onClick={toggleTheme}>
    //   {isDark ? "🌞 Light Mode" : "🌙 Dark Mode"}
    // </button>
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {isDark ? "🌞" : "🌙"}
    </button>
  );
}
