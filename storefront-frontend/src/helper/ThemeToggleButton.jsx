"use client";

import React, { useState, useEffect } from "react";

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(null);

  const updateThemeOnHtmlEl = (theme) => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "light";
      setTheme(storedTheme);
      updateThemeOnHtmlEl(storedTheme);
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      updateThemeOnHtmlEl(newTheme);
    }
  };

  if (!theme) return null;

  return (
    <button
      type='button'
      data-theme-toggle
      className='w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
      onClick={handleThemeToggle}
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggleButton;
