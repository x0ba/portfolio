import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark">(
    "theme-light"
  );

  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "theme-light" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !localStorage.getItem("theme")); // Only fall back to system if NO storage

    // Actually, simpler: we just enforce what the state is, assuming state is correct.
    // But wait, if we toggle to 'light', we want to force 'light' even if system is dark.

    // Let's stick to the plan: explicit 'light' or 'dark' writing to storage.
    const isEffectiveDark = theme === "dark";

    document.documentElement.classList[isEffectiveDark ? "add" : "remove"](
      "dark"
    );

    // We only want to write to localStorage if it's a user action, but here we are in an effect.
    // It's safer to just write the current state to localStorage,
    // BUT we need to be careful not to overwrite 'system' preference on initial load if we wanted to keep it,
    // but the requirement is to "remove the system option".
    // So enforcing an explicit setting is fine.

    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // Re-write to ensure clean initial hydration
  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "theme-light" : "dark"));
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
