/**
 * Ripple theme transition using the View Transitions API.
 * Expands a circular clip-path from the given origin, progressively
 * revealing the new theme underneath.
 */

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare global {
  interface Document {
    startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
  }
}

function applyThemeToggle(): void {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

export function toggleThemeWithRipple(x?: number, y?: number): void {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const supportsVT = typeof document.startViewTransition === "function";

  // Fallback: instant toggle
  if (!supportsVT || prefersReduced) {
    applyThemeToggle();
    return;
  }

  // Ripple origin — button center or viewport center
  const cx = x ?? window.innerWidth / 2;
  const cy = y ?? window.innerHeight / 2;

  // Radius large enough to cover the entire viewport from the origin
  const maxRadius = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy),
  );

  // Scope the view-transition CSS overrides so they don't affect Astro page transitions
  document.documentElement.classList.add("theme-transitioning");

  const transition = document.startViewTransition!(() => {
    applyThemeToggle();
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${cx}px ${cy}px)`,
          `circle(${maxRadius}px at ${cx}px ${cy}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });

  transition.finished.then(() => {
    document.documentElement.classList.remove("theme-transitioning");
  });
}
