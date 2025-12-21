// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://danielx.me",
  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ["cdn.sanity.io"],
  },

  integrations: [
    react(),
    sitemap(),
    sanity({
      projectId: "84m1lpmy",
      dataset: "production",
      useCdn: false,
      studioBasePath: "/studio",
    }),
  ],
  adapter: vercel(),
});
