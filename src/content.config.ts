import { defineCollection } from "astro:content";

const assets = defineCollection({
  loader: () => [],
});

export const collections = { assets };
