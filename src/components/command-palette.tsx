import { useCallback, useEffect, useState } from "react";
import { navigate } from "astro:transitions/client";
import { Command } from "cmdk";
import {
  FileUser,
  FolderOpen,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Wrench,
} from "lucide-react";
import { site } from "@/content";
import { toggleThemeWithRipple } from "@/lib/theme-transition";

const githubUrl =
  site.socials.find((social) => social.label === "GitHub")?.href || "#";
const linkedinUrl =
  site.socials.find((social) => social.label === "LinkedIn")?.href || "#";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const handler = () => setOpen(true);
    document.addEventListener("open-command-palette", handler);
    return () => document.removeEventListener("open-command-palette", handler);
  }, []);

  const runAndClose = useCallback((fn: () => void) => {
    fn();
    setOpen(false);
  }, []);

  const navigateTo = useCallback(
    (targetPath: string) => {
      runAndClose(() => {
        void navigate(targetPath);
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
      navigator.clipboard.writeText(site.email);
    });
  }, [runAndClose]);

  const openExternal = useCallback(
    (url: string) => {
      runAndClose(() => {
        window.open(url, "_blank");
      });
    },
    [runAndClose],
  );

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  if (!open) return null;

  return (
    <>
      <div cmdk-overlay="" onClick={() => setOpen(false)} />

      <div cmdk-dialog-wrapper="">
        <Command label="Command palette">
          <Command.Input
            placeholder="Type a command or search..."
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
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
                onSelect={() => openExternal(site.resumePath)}
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
                onSelect={() => openExternal(githubUrl)}
                value="github"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Command.Item>
              <Command.Item
                onSelect={() => openExternal(linkedinUrl)}
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
