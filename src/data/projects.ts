interface Project {
  name: string;
  description: string;
  category: "all" | "web" | "aiml";
  featured: boolean;
  tags: string[];
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
    code: "https://github.com/x0ba/ai-snake-pytorch",
  },
];
