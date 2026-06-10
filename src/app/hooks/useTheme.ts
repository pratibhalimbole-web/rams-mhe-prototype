import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  const isDark = resolvedTheme === "dark";
  return {
    isDark,
    toggle: () => setTheme(isDark ? "light" : "dark"),
  };
}
