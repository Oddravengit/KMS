import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
export const themes = ["light", "dark", "glass"] as const;
export type Theme = (typeof themes)[number];
const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem("kms.theme");
    if (themes.includes(saved as Theme)) return saved as Theme;
  } catch {
    /* Storage may be unavailable. */
  }
  return "light";
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("kms.theme", theme);
    } catch {
      /* Theme still works without persistence. */
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("ThemeProvider is required");
  return value;
}
