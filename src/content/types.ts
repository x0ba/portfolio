import type { ImageMetadata } from "astro";

export interface Category {
  slug: string;
  title: string;
  order: number;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  category: string;
  featured: boolean;
  tags: string[];
  image: ImageMetadata;
  link?: string;
  code?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  start: string;
  end: string;
  description: string;
  order: number;
}

export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end: string;
  description: string;
  order: number;
}

export interface StackItem {
  name: string;
  iconName?: string;
  order: number;
}

export type DoohickeyVibe =
  | "works-probably"
  | "surprisingly-useful"
  | "use-at-own-risk"
  | "its-a-vibe"
  | "abandoned-but-loved";

export interface Doohickey {
  slug: string;
  name: string;
  description: string;
  emoji: string;
  vibe: DoohickeyVibe;
  tags: string[];
  link?: string;
  code?: string;
  order: number;
}

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteSocialLink extends SiteLink {
  external?: boolean;
}

export interface SiteContent {
  siteTitle: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  personName: string;
  heroName: string;
  heroSubtitle: string;
  locationLabel: string;
  email: string;
  socials: SiteSocialLink[];
  navLinks: SiteLink[];
  footerText: string;
  resumePath: string;
  heroImage: ImageMetadata;
}
