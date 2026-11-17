const THEME_KEY = "kaliTheme";

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn("The theme cannot be saved in this browser.");
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
}

let currentTheme = getSavedTheme();
if (currentTheme !== "dark" && currentTheme !== "light") {
  currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
applyTheme(currentTheme);

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("themeToggle");
  if (!button) return;

  function updateButton() {
    const isDark = currentTheme === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  button.addEventListener("click", function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    saveTheme(currentTheme);
    updateButton();
  });

  updateButton();
});
