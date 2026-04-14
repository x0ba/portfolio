/**
 * Theme transition using the View Transitions API.
 * Cross-fades between themes while preserving Astro route transitions.
 */

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
}

type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "dark";

const DARK_CLASS = "dark";
const THEME_TRANSITIONING_CLASS = "theme-transitioning";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

function getStoredTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : null;
}

function resolveTheme() {
  return getStoredTheme() ?? DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle(DARK_CLASS, theme === "dark");
}

export function syncThemeFromStorage() {
  const theme = resolveTheme();
  applyTheme(theme);
  return theme;
}

function setTheme(theme: Theme) {
  applyTheme(theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  return theme;
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  return setTheme(isDark ? "light" : "dark");
}

function animateThemeFade(
  pseudoElement: "::view-transition-old(root)" | "::view-transition-new(root)",
) {
  document.documentElement.animate(
    {
      opacity:
        pseudoElement === "::view-transition-new(root)" ? [0, 1] : [1, 0],
    },
    {
      duration: 180,
      easing: "ease-out",
      pseudoElement,
    },
  );
}

export function toggleThemeWithRipple(x?: number, y?: number) {
  void x;
  void y;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const startViewTransition = (
    document as Document & {
      startViewTransition?: (
        callback: () => void | Promise<void>,
      ) => ViewTransition;
    }
  ).startViewTransition;
  const supportsVT = typeof startViewTransition === "function";

  // Fallback: instant toggle
  if (!supportsVT || prefersReduced) {
    toggleTheme();
    return;
  }

  // Scope the view-transition CSS overrides so they don't affect Astro page transitions
  const cleanup = () => {
    document.documentElement.classList.remove(THEME_TRANSITIONING_CLASS);
  };

  document.documentElement.classList.add(THEME_TRANSITIONING_CLASS);
  let transition: ViewTransition;

  try {
    transition = startViewTransition.call(document, () => {
      toggleTheme();
    });
  } catch {
    cleanup();
    toggleTheme();
    return;
  }

  void transition.ready
    .then(() => {
      animateThemeFade("::view-transition-old(root)");
      animateThemeFade("::view-transition-new(root)");
    })
    .catch(cleanup);

  void transition.finished.finally(cleanup);
}
