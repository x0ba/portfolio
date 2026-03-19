import { sanityClient } from "sanity:client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Types
export interface SanityCategory {
  _id: string;
  title: string;
  slug: { current: string };
  order?: number;
}

export interface SanityProject {
  _id: string;
  name: string;
  slug?: { current: string };
  description?: string;
  category?: SanityCategory;
  featured: boolean;
  tags?: string[];
  image?: SanityImageSource;
  link?: string;
  code?: string;
}

export interface RouteableSanityProject extends SanityProject {
  slug: { current: string };
}

export function isRouteableProject(
  project: SanityProject,
): project is RouteableSanityProject {
  return (
    typeof project.slug?.current === "string" && project.slug.current.length > 0
  );
}

export interface SanityExperience {
  _id: string;
  company: string;
  position: string;
  startYear?: string;
  endYear?: string;
  description?: string;
  order?: number;
}

export interface SanityEducation {
  _id: string;
  school: string;
  degree: string;
  startYear?: string;
  endYear?: string;
  description?: string;
  order?: number;
}

export interface SanityStackItem {
  _id: string;
  name: string;
  iconName?: string;
  order?: number;
}

// Queries
export async function getCategories(): Promise<SanityCategory[]> {
  return await sanityClient.fetch(
    `*[_type == "category"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      order
    }`,
  );
}

export async function getProjects(): Promise<SanityProject[]> {
  return await sanityClient.fetch(
    `*[_type == "project"] | order(featured desc, _createdAt desc) {
      _id,
      name,
      slug,
      description,
      category->{
        _id,
        title,
        slug
      },
      featured,
      tags,
      image,
      link,
      code
    }`,
  );
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await sanityClient.fetch<{ slug?: { current?: string } }[]>(
    `*[_type == "project" && defined(slug.current)] {
      slug
    }`,
  );

  return projects
    .map((project) => project.slug?.current)
    .filter(
      (slug): slug is string => typeof slug === "string" && slug.length > 0,
    );
}

export async function getProjectBySlug(slug: string) {
  return await sanityClient.fetch<SanityProject | null>(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      category->{
        _id,
        title,
        slug
      },
      featured,
      tags,
      image,
      link,
      code
    }`,
    { slug },
  );
}

export async function getFeaturedProjects(): Promise<SanityProject[]> {
  return await sanityClient.fetch(
    `*[_type == "project" && featured == true] | order(_createdAt desc) {
      _id,
      name,
      slug,
      description,
      category->{
        _id,
        title,
        slug
      },
      featured,
      tags,
      image,
      link,
      code
    }`,
  );
}

export async function getExperiences(): Promise<SanityExperience[]> {
  return await sanityClient.fetch(
    `*[_type == "experience"] | order(order asc, _createdAt desc) {
      _id,
      company,
      position,
      startYear,
      endYear,
      description,
      order
    }`,
  );
}

export async function getEducation(): Promise<SanityEducation[]> {
  return await sanityClient.fetch(
    `*[_type == "education"] | order(order asc, _createdAt desc) {
      _id,
      school,
      degree,
      startYear,
      endYear,
      description,
      order
    }`,
  );
}

export async function getStackItems(): Promise<SanityStackItem[]> {
  return await sanityClient.fetch(
    `*[_type == "stackItem"] | order(order asc, name asc) {
      _id,
      name,
      iconName,
      order
    }`,
  );
}

export interface SanityDoohickey {
  _id: string;
  name: string;
  slug?: { current: string };
  description?: string;
  emoji?: string;
  vibe?: string;
  tags?: string[];
  link?: string;
  code?: string;
  order?: number;
}

export interface SanitySiteSettings {
  _id: string;
  title?: string;
  resumeUrl?: string;
}

export async function getDoohickeys(): Promise<SanityDoohickey[]> {
  return await sanityClient.fetch(
    `*[_type == "doohickey"] | order(order asc, _createdAt desc) {
      _id,
      name,
      slug,
      description,
      emoji,
      vibe,
      tags,
      link,
      code,
      order
    }`,
  );
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return await sanityClient.fetch(
    `*[_type == "siteSettings"][0] {
      _id,
      title,
      "resumeUrl": resume.asset->url
    }`,
  );
}

export async function getResumeUrl(): Promise<string | null> {
  const siteSettings = await getSiteSettings();
  return siteSettings?.resumeUrl ?? null;
}
