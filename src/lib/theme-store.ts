import { create } from "zustand";

type Theme = "light" | "dark";

const STORAGE_KEY = "talentops.theme";

function readInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useTheme = create<ThemeState>((set, get) => {
  const initial = readInitial();
  apply(initial);
  return {
    theme: initial,
    setTheme(t) {
      apply(t);
      window.localStorage.setItem(STORAGE_KEY, t);
      set({ theme: t });
    },
    toggle() {
      const next: Theme = get().theme === "dark" ? "light" : "dark";
      apply(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      set({ theme: next });
    },
  };
});
