import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { SanityProject, SanityCategory } from "@/lib/sanity";
import { SiGithub } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";

interface ProjectWithOptimizedImage extends SanityProject {
  optimizedImageUrl: string | null;
}

interface ProjectTabsProps {
  projects: ProjectWithOptimizedImage[];
  categories: SanityCategory[];
}

function ProjectCard({ project }: { project: ProjectWithOptimizedImage }) {
  return (
    <div className="group rounded-xl border border-border overflow-hidden bg-card hover:border-foreground/20 transition-all duration-300">
      {project.optimizedImageUrl && (
        <div className="overflow-hidden">
          <img
            src={project.optimizedImageUrl}
            alt={project.name}
            width={1600}
            height={900}
            className="w-full aspect-video object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">
            {project.name}
          </h3>
          <div className="flex items-center gap-2.5 flex-none pt-0.5">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <RiExternalLinkFill className="w-4 h-4" />
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiGithub className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectGrid({
  projects,
}: {
  projects: ProjectWithOptimizedImage[];
}) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No projects in this category.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}

export default function ProjectTabs({
  projects,
  categories,
}: ProjectTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-5">
      <TabsList className="w-full">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat._id} value={cat.slug.current}>
            {cat.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
        <ProjectGrid projects={projects} />
      </TabsContent>
      {categories.map((cat) => (
        <TabsContent key={cat._id} value={cat.slug.current}>
          <ProjectGrid
            projects={projects.filter(
              (p) => p.category?.slug?.current === cat.slug.current
            )}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
