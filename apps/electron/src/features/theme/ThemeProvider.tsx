import { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const getSystemTheme = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

const getLocalTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return getSystemTheme();
};

const setLocalTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-mode", theme);
  localStorage.setItem("theme", theme);
};

const observeDomTheme = (callback: (theme: Theme) => unknown) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.attributeName === "data-mode" &&
        mutation.target === document.documentElement
      ) {
        callback(document.documentElement.dataset.mode as Theme);
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  return () => observer.disconnect();
};

interface IThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
export const ThemeContext = createContext<IThemeContext>({
  theme: getLocalTheme(),
  setTheme: () => {},
});

const ThemeProvider: React.FC<
  React.PropsWithChildren<{ initialTheme?: Theme }>
> = ({ children, initialTheme }) => {
  const _theme = initialTheme ?? getLocalTheme() ?? "system";
  const [theme, _setTheme] = useState<Theme>(
    _theme === "system" ? getSystemTheme() : _theme,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      setTheme(mediaQuery.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", listener);
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  const setTheme = (_theme: Theme) => {
    const theme = _theme === "system" ? getSystemTheme() : _theme;
    _setTheme(theme);
    setLocalTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
