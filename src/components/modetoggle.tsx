import type { MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toggleThemeWithRipple } from "@/lib/theme-transition";

export function ModeToggle() {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    toggleThemeWithRipple(x, y);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="interactive-button"
      onClick={handleClick}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
