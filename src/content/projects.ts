import type { Project } from "./types";
import rxlogImage from "./assets/images/scr-20260329-tplk.png";
import ssaAtUcsdMemberDashboardImage from "./assets/images/dashboard-84a4c648.png";
import schedulesyncImage from "./assets/images/scr-20260317-resa.png";
import snakeGameAgentImage from "./assets/images/snake.png";
import ssaLandingPageImage from "./assets/images/ssa-web.png";

export const projects: Project[] = [
  {
    slug: "rxlog",
    name: "RXLog",
    description: "Because my family and I wanted a better medication logger.",
    category: "web",
    featured: true,
    tags: ["tanstack-start", "convex", "react"],
    image: rxlogImage,
    link: "https://rxlog.danielx.link",
    code: "https://github.com/x0ba/rxlog",
  },
  {
    slug: "ssa-at-ucsd-member-dashboard",
    name: "SSA at UCSD Member Dashboard",
    description:
      "A unified dashboard for members of the Symphonic Student Association at UCSD to view links, RSVP to events, and admins to manage events, members, and more",
    category: "web",
    featured: true,
    tags: ["nextjs", "convex", "clerk"],
    image: ssaAtUcsdMemberDashboardImage,
    link: "https://members.ssaucsd.org",
    code: "https://github.com/ssaucsd/ssaucsd-org",
  },
  {
    slug: "schedulesync",
    name: "ScheduleSync",
    description:
      "A web application that uses an LLM to convert screenshots of course schedules into an iCal file or sync it directly to Google Calendar",
    category: "web",
    featured: true,
    tags: ["nextjs", "trpc", "ai-sdk", "google-cloud"],
    image: schedulesyncImage,
    link: "https://schedulesync.tech",
    code: "https://github.com/x0ba/schedulesync",
  },
  {
    slug: "snake-game-agent",
    name: "Snake Game Agent",
    description:
      "An agent that is trained through reinforcement learning (Deep-Q Learning) to play snake",
    category: "aiml",
    featured: false,
    tags: ["pytorch", "numpy", "pygame", "matplotlib"],
    image: snakeGameAgentImage,
    link: "",
    code: "https://github.com/x0ba/ai-snake-pytorch",
  },
  {
    slug: "ssa-landing-page",
    name: "SSA Landing Page",
    description:
      "A beautifully designed, SEO optimized, responsive landing page for the Symphonic Student Association at UCSD",
    category: "web",
    featured: false,
    tags: ["nextjs", "convex"],
    image: ssaLandingPageImage,
    link: "https://ssaucsd.org",
    code: "https://github.com/ssaucsd/ssaucsd-org",
  },
];
