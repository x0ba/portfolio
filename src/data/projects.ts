import type { ImageMetadata } from "astro";
import scheduleSyncImg from "../images/schedulesync.png";
import dashboardImg from "../images/dashboard.png";
import xgalleryImg from "../images/xgallery.png";
import ssaLandingImg from "../images/ssalanding.png";
import snakeImg from "../images/snake.png";

export interface Project {
  name: string;
  description: string;
  category: "all" | "web" | "aiml";
  featured: boolean;
  tags: string[];
  image: ImageMetadata;
  link?: string;
  code?: string;
}

export const projects: Project[] = [
  {
    name: "ScheduleSync",
    description:
      "A web application that uses an LLM to convert screenshots of course schedules into an iCal file or sync it directly to Google Calendar",
    tags: ["nextjs", "trpc", "ai-sdk", "google-calendar-api"],
    category: "web",
    featured: true,
    image: scheduleSyncImg,
    link: "https://schedulesync.tech",
    code: "https://github.com/x0ba/schedulesync",
  },
  {
    name: "SSA at UCSD Member Dashboard",
    description:
      "A unified dashboard for members of the Symphonic Student Association at UCSD to view links, RSVP to events, and admins to manage events, members, and more",
    tags: ["nextjs", "drizzle", "postgresql"],
    category: "web",
    featured: true,
    image: dashboardImg,
    link: "https://members.ssaucsd.org",
    code: "https://github.com/x0ba/ssa-dashboard",
  },
  {
    name: "XGallery",
    description:
      "A simple image gallery for my personal photos. A practical application of parallel routing.",
    tags: ["nextjs", "postgresql", "drizzle", "parallel-routing"],
    category: "web",
    featured: false,
    image: xgalleryImg,
    link: "https://gallery.danielx.me",
    code: "https://github.com/x0ba/xgallery",
  },
  {
    name: "SSA Landing Page",
    description:
      "A beautifully designed, SEO optimized, responsive landing page for the Symphonic Student Association at UCSD",
    tags: ["nextjs", "tailwindcss", "postgresql"],
    category: "web",
    featured: false,
    image: ssaLandingImg,
    link: "https://ssaucsd.org",
    code: "https://github.com/x0ba/ssa-site",
  },
  {
    name: "AI Snake Agent",
    description:
      "An agent that is trained through reinforcement learning (Deep-Q Learning) to play snake",
    tags: ["pytorch", "numpy", "pygame", "matplotlib"],
    category: "aiml",
    featured: false,
    image: snakeImg,
    code: "https://github.com/x0ba/ai-snake-pytorch",
  },
];
