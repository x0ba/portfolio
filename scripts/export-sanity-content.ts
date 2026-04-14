import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const projectId = "84m1lpmy";
const dataset = "production";
const apiVersion = "v2025-02-19";
const repoRoot = process.cwd();
const contentDir = path.join(repoRoot, "src/content");
const imageDir = path.join(contentDir, "assets/images");
const publicDir = path.join(repoRoot, "public");
const filesDir = path.join(publicDir, "files");
const resumePath = path.join(publicDir, "resume.pdf");

const query = `{
  "categories": *[_type == "category"] | order(order asc, title asc) {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    order
  },
  "projects": *[_type == "project"] | order(featured desc, _createdAt desc) {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    description,
    "category": category->slug.current,
    featured,
    tags,
    link,
    code,
    "imageRef": image.asset->_id
  },
  "experiences": *[_type == "experience"] | order(order asc, _createdAt desc) {
    _id,
    _createdAt,
    company,
    position,
    "start": startYear,
    "end": endYear,
    description,
    order
  },
  "education": *[_type == "education"] | order(order asc, _createdAt desc) {
    _id,
    _createdAt,
    school,
    degree,
    "start": startYear,
    "end": endYear,
    description,
    order
  },
  "stackItems": *[_type == "stackItem"] | order(order asc, name asc) {
    _id,
    _createdAt,
    name,
    iconName,
    order
  },
  "doohickeys": *[_type == "doohickey"] | order(order asc, _createdAt desc) {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    description,
    emoji,
    vibe,
    tags,
    link,
    code,
    order
  },
  "siteSettings": *[_type == "siteSettings"][0] {
    _id,
    title,
    "resumeRef": resume.asset->_id
  },
  "imageAssets": *[_type == "sanity.imageAsset"] | order(originalFilename asc, _id asc) {
    _id,
    originalFilename,
    url
  },
  "fileAssets": *[_type == "sanity.fileAsset"] | order(originalFilename asc, _id asc) {
    _id,
    originalFilename,
    url,
    mimeType,
    size
  }
}`;

type CategoryDoc = {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  order: number | null;
};

type ProjectDoc = {
  _id: string;
  _createdAt: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  featured: boolean;
  tags?: string[];
  link?: string;
  code?: string;
  imageRef?: string;
};

type ExperienceDoc = {
  _id: string;
  _createdAt: string;
  company: string;
  position: string;
  start?: string;
  end?: string;
  description?: string;
  order: number | null;
};

type EducationDoc = {
  _id: string;
  _createdAt: string;
  school: string;
  degree: string;
  start?: string;
  end?: string;
  description?: string;
  order: number | null;
};

type StackItemDoc = {
  _id: string;
  _createdAt: string;
  name: string;
  iconName?: string;
  order: number | null;
};

type DoohickeyDoc = {
  _id: string;
  _createdAt: string;
  name: string;
  slug?: string;
  description?: string;
  emoji?: string;
  vibe?: string;
  tags?: string[];
  link?: string;
  code?: string;
  order: number | null;
};

type SiteSettingsDoc = {
  _id: string;
  title?: string;
  resumeRef?: string;
};

type ImageAssetDoc = {
  _id: string;
  originalFilename?: string;
  url: string;
};

type FileAssetDoc = {
  _id: string;
  originalFilename?: string;
  url: string;
  mimeType?: string;
  size?: number;
};

type QueryResult = {
  categories: CategoryDoc[];
  projects: ProjectDoc[];
  experiences: ExperienceDoc[];
  education: EducationDoc[];
  stackItems: StackItemDoc[];
  doohickeys: DoohickeyDoc[];
  siteSettings: SiteSettingsDoc | null;
  imageAssets: ImageAssetDoc[];
  fileAssets: FileAssetDoc[];
};

const sanitizeSegment = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "asset";

const extensionFrom = (asset: { originalFilename?: string; url: string }) => {
  const fromName = asset.originalFilename
    ? path.extname(asset.originalFilename)
    : "";

  if (fromName) {
    return fromName.toLowerCase();
  }

  return path.extname(new URL(asset.url).pathname).toLowerCase();
};

const baseNameFrom = (asset: { originalFilename?: string; _id: string }) => {
  const source = asset.originalFilename
    ? path.basename(
        asset.originalFilename,
        path.extname(asset.originalFilename),
      )
    : asset._id;

  return sanitizeSegment(source);
};

const makeLocalNames = <
  T extends { _id: string; originalFilename?: string; url: string },
>(
  assets: T[],
) => {
  const counts = new Map<string, number>();

  for (const asset of assets) {
    const key = `${baseNameFrom(asset)}${extensionFrom(asset)}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return new Map(
    assets.map((asset) => {
      const extension = extensionFrom(asset);
      const baseName = baseNameFrom(asset);
      const key = `${baseName}${extension}`;
      const duplicateCount = counts.get(key) ?? 0;
      const suffix =
        duplicateCount > 1
          ? `-${asset._id.replace(/^[^-]+-/, "").slice(0, 8)}`
          : "";

      return [asset._id, `${baseName}${suffix}${extension}`];
    }),
  );
};

const fetchQuery = async () => {
  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/${apiVersion}/data/query/${dataset}`,
  );
  endpoint.searchParams.set("query", query);

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Sanity query failed with ${response.status}`);
  }

  const body = (await response.json()) as { result: QueryResult };
  return body.result;
};

const downloadFile = async (url: string, targetPath: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed downloading ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(targetPath, buffer);
};

const writeModule = async (targetPath: string, contents: string) => {
  await writeFile(targetPath, `${contents.trim()}\n`);
};

const toLiteral = (value: unknown) => JSON.stringify(value, null, 2);

const toIdentifier = (value: string) => {
  const normalized = value
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");

  return /^[A-Za-z_]/.test(normalized) ? normalized : `asset${normalized}`;
};

const buildCategoriesModule = (categories: CategoryDoc[]) => `
import type { Category } from "./types";

export const categories: Category[] = ${toLiteral(
  categories.map((category) => ({
    slug: category.slug,
    title: category.title,
    order: category.order ?? 0,
  })),
)};
`;

const buildExperienceModule = (experiences: ExperienceDoc[]) => `
import type { ExperienceItem } from "./types";

export const experiences: ExperienceItem[] = ${toLiteral(
  experiences.map((experience) => ({
    company: experience.company,
    position: experience.position,
    start: experience.start ?? "",
    end: experience.end ?? "",
    description: experience.description ?? "",
    order: experience.order ?? 0,
  })),
)};
`;

const buildEducationModule = (education: EducationDoc[]) => `
import type { EducationItem } from "./types";

export const education: EducationItem[] = ${toLiteral(
  education.map((item) => ({
    school: item.school,
    degree: item.degree,
    start: item.start ?? "",
    end: item.end ?? "",
    description: item.description ?? "",
    order: item.order ?? 0,
  })),
)};
`;

const buildStackModule = (stackItems: StackItemDoc[]) => `
import type { StackItem } from "./types";

export const stackItems: StackItem[] = ${toLiteral(
  stackItems.map((item) => ({
    name: item.name,
    iconName: item.iconName ?? "",
    order: item.order ?? 0,
  })),
)};
`;

const buildDoohickeysModule = (doohickeys: DoohickeyDoc[]) => `
import type { Doohickey } from "./types";

export const doohickeys: Doohickey[] = ${toLiteral(
  doohickeys.map((item) => ({
    slug: item.slug ?? sanitizeSegment(item.name),
    name: item.name,
    description: item.description ?? "",
    emoji: item.emoji ?? "",
    vibe: item.vibe ?? "works-probably",
    tags: item.tags ?? [],
    link: item.link ?? "",
    code: item.code ?? "",
    order: item.order ?? 0,
  })),
)};
`;

const buildProjectsModule = (
  projects: ProjectDoc[],
  imageNames: Map<string, string>,
) => {
  const projectImports = projects
    .filter((project) => project.imageRef)
    .map((project) => {
      const fileName = imageNames.get(project.imageRef!);

      if (!fileName) {
        throw new Error(`Missing image asset for project ${project.slug}`);
      }

      const identifier = `${toIdentifier(project.slug)}Image`;
      return `import ${identifier} from "./assets/images/${fileName}";`;
    });

  const projectEntries = projects.map((project) => {
    const imageIdentifier = project.imageRef
      ? `${toIdentifier(project.slug)}Image`
      : "null";

    return `  {
    slug: ${JSON.stringify(project.slug)},
    name: ${JSON.stringify(project.name)},
    description: ${JSON.stringify(project.description ?? "")},
    category: ${JSON.stringify(project.category ?? "")},
    featured: ${project.featured},
    tags: ${JSON.stringify(project.tags ?? [])},
    image: ${imageIdentifier},
    link: ${JSON.stringify(project.link ?? "")},
    code: ${JSON.stringify(project.code ?? "")}
  }`;
  });

  return `
import type { Project } from "./types";
${projectImports.join("\n")}

export const projects: Project[] = [
${projectEntries.join(",\n")}
];
`;
};

const buildManifest = (
  result: QueryResult,
  imageNames: Map<string, string>,
  fileNames: Map<string, string>,
) => {
  const imageReferences = new Map<string, string[]>();
  const fileReferences = new Map<string, string[]>();

  for (const project of result.projects) {
    if (project.imageRef) {
      imageReferences.set(project.imageRef, [
        ...(imageReferences.get(project.imageRef) ?? []),
        `project:${project.slug}`,
      ]);
    }
  }

  if (result.siteSettings?.resumeRef) {
    fileReferences.set(result.siteSettings.resumeRef, [
      ...(fileReferences.get(result.siteSettings.resumeRef) ?? []),
      "siteSettings:resume",
    ]);
  }

  return {
    source: {
      projectId,
      dataset,
      apiVersion,
    },
    counts: {
      categories: result.categories.length,
      projects: result.projects.length,
      experiences: result.experiences.length,
      education: result.education.length,
      stackItems: result.stackItems.length,
      doohickeys: result.doohickeys.length,
      imageAssets: result.imageAssets.length,
      fileAssets: result.fileAssets.length,
    },
    documents: {
      categories: result.categories.map((category) => ({
        id: category._id,
        slug: category.slug,
        title: category.title,
      })),
      projects: result.projects.map((project) => ({
        id: project._id,
        slug: project.slug,
        imageAssetId: project.imageRef ?? null,
      })),
      experiences: result.experiences.map((item) => ({
        id: item._id,
        company: item.company,
      })),
      education: result.education.map((item) => ({
        id: item._id,
        school: item.school,
      })),
      stackItems: result.stackItems.map((item) => ({
        id: item._id,
        name: item.name,
      })),
      doohickeys: result.doohickeys.map((item) => ({
        id: item._id,
        slug: item.slug ?? sanitizeSegment(item.name),
      })),
      siteSettings: result.siteSettings
        ? {
            id: result.siteSettings._id,
            title: result.siteSettings.title ?? null,
            resumeAssetId: result.siteSettings.resumeRef ?? null,
          }
        : null,
    },
    assets: {
      images: result.imageAssets.map((asset) => ({
        id: asset._id,
        originalFilename: asset.originalFilename ?? null,
        sourceUrl: asset.url,
        localPath: `src/content/assets/images/${imageNames.get(asset._id)}`,
        referencedBy: imageReferences.get(asset._id) ?? [],
      })),
      files: result.fileAssets.map((asset) => ({
        id: asset._id,
        originalFilename: asset.originalFilename ?? null,
        sourceUrl: asset.url,
        mimeType: asset.mimeType ?? null,
        size: asset.size ?? null,
        localPath:
          asset._id === result.siteSettings?.resumeRef
            ? "public/resume.pdf"
            : `public/files/${fileNames.get(asset._id)}`,
        referencedBy: fileReferences.get(asset._id) ?? [],
      })),
    },
  };
};

await mkdir(imageDir, { recursive: true });
await mkdir(filesDir, { recursive: true });

const result = await fetchQuery();
const imageNames = makeLocalNames(result.imageAssets);
const fileNames = makeLocalNames(result.fileAssets);

for (const asset of result.imageAssets) {
  const fileName = imageNames.get(asset._id);

  if (!fileName) {
    throw new Error(`No local file name for image asset ${asset._id}`);
  }

  await downloadFile(asset.url, path.join(imageDir, fileName));
}

for (const asset of result.fileAssets) {
  const fileName = fileNames.get(asset._id);

  if (!fileName) {
    throw new Error(`No local file name for file asset ${asset._id}`);
  }

  const targetPath =
    asset._id === result.siteSettings?.resumeRef
      ? resumePath
      : path.join(filesDir, fileName);

  await downloadFile(asset.url, targetPath);
}

await writeModule(
  path.join(contentDir, "categories.ts"),
  buildCategoriesModule(result.categories),
);
await writeModule(
  path.join(contentDir, "experience.ts"),
  buildExperienceModule(result.experiences),
);
await writeModule(
  path.join(contentDir, "education.ts"),
  buildEducationModule(result.education),
);
await writeModule(
  path.join(contentDir, "stack.ts"),
  buildStackModule(result.stackItems),
);
await writeModule(
  path.join(contentDir, "doohickeys.ts"),
  buildDoohickeysModule(result.doohickeys),
);
await writeModule(
  path.join(contentDir, "projects.ts"),
  buildProjectsModule(result.projects, imageNames),
);
await writeFile(
  path.join(contentDir, "sanity-manifest.json"),
  `${JSON.stringify(buildManifest(result, imageNames, fileNames), null, 2)}\n`,
);

console.log(
  `Exported ${result.projects.length} projects, ${result.imageAssets.length} images, and ${result.fileAssets.length} files from Sanity.`,
);
