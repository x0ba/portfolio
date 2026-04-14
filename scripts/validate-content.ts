import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories, doohickeys, projects, site } from "../src/content";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const ensureUnique = (label: string, values: string[]) => {
  const seen = new Set<string>();

  for (const value of values) {
    assert(value.length > 0, `${label} contains an empty value`);
    assert(!seen.has(value), `Duplicate ${label}: ${value}`);
    seen.add(value);
  }
};

const categorySlugs = new Set(categories.map((category) => category.slug));

ensureUnique(
  "project slug",
  projects.map((project) => project.slug),
);
ensureUnique(
  "doohickey slug",
  doohickeys.map((doohickey) => doohickey.slug),
);

for (const project of projects) {
  assert(
    categorySlugs.has(project.category),
    `Project ${project.slug} references missing category ${project.category}`,
  );
  assert(
    project.image,
    `Project ${project.slug} is missing a local image import`,
  );
}

assert(site.socials.length > 0, "site.socials must not be empty");
assert(site.navLinks.length > 0, "site.navLinks must not be empty");

for (const social of site.socials) {
  assert(social.label.length > 0, "site.socials contains an empty label");
  assert(social.href.length > 0, `Social ${social.label} is missing href`);
}

for (const link of site.navLinks) {
  assert(link.label.length > 0, "site.navLinks contains an empty label");
  assert(link.href.length > 0, `Nav link ${link.label} is missing href`);
}

await access(path.join(rootDir, "public", "resume.pdf"));

console.log("Content validation passed.");
