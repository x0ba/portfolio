import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import {
  Home,
  FolderOpen,
  Wrench,
  Sun,
  Moon,
  FileUser,
  Mail,
  Github,
  Linkedin,
  Search,
} from "lucide-react";
import { toggleThemeWithRipple } from "@/lib/theme-transition";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Listen for custom event from navbar trigger button
  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("open-command-palette", handler);
    return () => document.removeEventListener("open-command-palette", handler);
  }, []);

  const runAndClose = useCallback(
    (fn: () => void) => {
      fn();
      setOpen(false);
    },
    [],
  );

  const navigateTo = useCallback(
    (path: string) => {
      runAndClose(() => {
        // Use Astro view transitions navigation if available
        const nav = (window as any).navigation;
        if (typeof (window as any).__astro_navigate === "function") {
          (window as any).__astro_navigate(path);
        } else {
          window.location.href = path;
        }
      });
    },
    [runAndClose],
  );

  const toggleTheme = useCallback(() => {
    runAndClose(() => {
      toggleThemeWithRipple();
    });
  }, [runAndClose]);

  const copyEmail = useCallback(() => {
    runAndClose(() => {
      navigator.clipboard.writeText("hi@danielx.me");
    });
  }, [runAndClose]);

  const openExternal = useCallback(
    (url: string) => {
      runAndClose(() => window.open(url, "_blank"));
    },
    [runAndClose],
  );

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  if (!open) return null;

  return (
    <>
      {/* Overlay — rendered as a sibling, behind the dialog */}
      <div cmdk-overlay="" onClick={() => setOpen(false)} />

      {/* Dialog wrapper — on top of overlay */}
      <div cmdk-dialog-wrapper="">
        <Command label="Command palette">
          <Command.Input
            placeholder="Type a command or search..."
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            autoFocus
          />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="Navigation">
              <Command.Item onSelect={() => navigateTo("/")} value="home">
                <Home className="w-4 h-4" />
                Home
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/projects")}
                value="projects"
              >
                <FolderOpen className="w-4 h-4" />
                Projects
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/doohickeys")}
                value="doohickeys"
              >
                <Wrench className="w-4 h-4" />
                Doohickeys
              </Command.Item>
            </Command.Group>

            <Command.Separator />

            <Command.Group heading="Actions">
              <Command.Item
                onSelect={toggleTheme}
                value="toggle theme dark light"
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                Toggle Theme
              </Command.Item>
              <Command.Item
                onSelect={() => openExternal("/resume.pdf")}
                value="resume cv"
              >
                <FileUser className="w-4 h-4" />
                Open Resume
              </Command.Item>
              <Command.Item onSelect={copyEmail} value="copy email contact">
                <Mail className="w-4 h-4" />
                Copy Email
              </Command.Item>
            </Command.Group>

            <Command.Separator />

            <Command.Group heading="Social">
              <Command.Item
                onSelect={() => openExternal("https://github.com/x0ba")}
                value="github"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  openExternal("https://www.linkedin.com/in/daniel-xu-sd")
                }
                value="linkedin"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </>
  );
}
