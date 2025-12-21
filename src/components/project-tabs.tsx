import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { SanityProject, SanityCategory } from "@/lib/sanity";

// Extended type with optimized image URL from Astro
interface ProjectWithOptimizedImage extends SanityProject {
  optimizedImageUrl: string | null;
}

interface ProjectTabsProps {
  projects: ProjectWithOptimizedImage[];
  categories: SanityCategory[];
}

interface ProjectCardProps {
  project: ProjectWithOptimizedImage;
}

function ProjectCardInner({ project }: ProjectCardProps) {
  return (
    <div className="w-full flex flex-col h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
      {project.optimizedImageUrl && (
        <img
          src={project.optimizedImageUrl}
          alt={project.name}
          width={1600}
          height={900}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      )}
      <div className="flex flex-col gap-3 flex-1 p-6 pt-0 mt-6">
        <h3 className="text-lg font-bold">{project.name}</h3>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap items-center gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center p-6 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
            >
              Demo
            </a>
          )}
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectTabs({
  projects,
  categories,
}: ProjectTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat._id} value={cat.slug.current}>
            {cat.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value="all"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {projects.map((project) => (
          <ProjectCardInner key={project._id} project={project} />
        ))}
      </TabsContent>
      {categories.map((cat) => (
        <TabsContent
          key={cat._id}
          value={cat.slug.current}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects
            .filter((p) => p.category?.slug?.current === cat.slug.current)
            .map((project) => (
              <ProjectCardInner key={project._id} project={project} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
