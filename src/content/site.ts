import heroImage from "@/images/hero.webp";
import type { SiteContent } from "./types";

export const site: SiteContent = {
  siteTitle: "Portfolio",
  defaultSeoTitle: "Daniel Xu | Full Stack Software Engineer",
  defaultSeoDescription:
    "Full stack software engineer specializing in building scalable web applications with Next.js. Math + CS at UCSD.",
  personName: "Daniel Xu",
  heroName: "Daniel Xu",
  heroSubtitle: "<s>Doohickey</s> Full Stack Software Engineer",
  locationLabel: "La Jolla, CA",
  email: "hi@danielx.me",
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/x0ba",
      external: true,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/daniel-xu-sd",
      external: true,
    },
  ],
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Doohickeys", href: "/doohickeys" },
  ],
  footerText: "Made With ❤️ in La Jolla, CA.",
  resumePath: "/resume.pdf",
  heroImage,
};
