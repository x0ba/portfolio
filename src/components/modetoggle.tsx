import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [theme, setThemeState] = React.useState<"theme-light" | "dark">("dark");
  const isUserAction = React.useRef(false);

  // On mount, sync React state with the actual DOM state (set by the inline script)
  React.useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setThemeState(isDarkMode ? "dark" : "theme-light");
  }, []);

  // Update DOM and localStorage, but only write to storage on user actions
  React.useEffect(() => {
    const isEffectiveDark = theme === "dark";

    document.documentElement.classList[isEffectiveDark ? "add" : "remove"](
      "dark",
    );

    // Only persist to localStorage if this was a user-initiated change
    if (isUserAction.current) {
      localStorage.setItem("theme", isEffectiveDark ? "dark" : "light");
      isUserAction.current = false;
    }
  }, [theme]);

  const toggleTheme = () => {
    isUserAction.current = true;
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
