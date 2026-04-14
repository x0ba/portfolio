import { useEffect, useState, type MouseEvent } from "react";
import { SiGithub } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Category } from "@/content";
import ProjectDetailContent, {
  type ProjectWithOptimizedImage,
} from "@/components/project-detail-content";

interface ProjectTabsProps {
  projects: ProjectWithOptimizedImage[];
  categories: Category[];
  basePath?: string;
}

function normalizeBasePath(basePath: string) {
  if (basePath === "/") {
    return basePath;
  }

  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
}

function getProjectPath(basePath: string, slug: string) {
  return `${normalizeBasePath(basePath)}/${slug}`;
}

function getProjectSlugFromPathname(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);

  if (pathname === normalizedBasePath) {
    return null;
  }

  const prefix = `${normalizedBasePath}/`;

  if (!pathname.startsWith(prefix)) {
    return null;
  }

  const slug = pathname.slice(prefix.length);

  if (!slug || slug.includes("/")) {
    return null;
  }

  return decodeURIComponent(slug);
}

function shouldInterceptNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

function ProjectCard({
  project,
  href,
  onNavigate,
}: {
  project: ProjectWithOptimizedImage;
  href: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <div className="interactive-card group relative rounded-xl border border-border overflow-hidden bg-card cursor-pointer">
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
      <div className="p-4 flex flex-col gap-2 relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium text-foreground">{project.name}</h3>
          <div className="flex items-center gap-2.5 flex-none pt-0.5 relative z-20">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-icon-link text-muted-foreground hover:text-foreground"
                aria-label={`Visit ${project.name}`}
              >
                <RiExternalLinkFill className="w-4 h-4" />
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-icon-link text-muted-foreground hover:text-foreground"
                aria-label={`View ${project.name} source code`}
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
        {project.tags.length > 0 && (
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

      <a
        href={href}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`View ${project.name} details`}
        onClick={onNavigate}
      >
        <span className="sr-only">View {project.name} details</span>
      </a>
    </div>
  );
}

function ProjectGrid({
  projects,
  basePath,
  onProjectNavigate,
}: {
  projects: ProjectWithOptimizedImage[];
  basePath: string;
  onProjectNavigate: (
    project: ProjectWithOptimizedImage,
    event: MouseEvent<HTMLAnchorElement>,
  ) => void;
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
        <ProjectCard
          key={project.slug}
          project={project}
          href={getProjectPath(basePath, project.slug)}
          onNavigate={(event) => onProjectNavigate(project, event)}
        />
      ))}
    </div>
  );
}

export default function ProjectTabs({
  projects,
  categories,
  basePath = "/projects",
}: ProjectTabsProps) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const projectsBySlug = new Map(
    projects.map((project) => [project.slug, project]),
  );
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const syncProjectFromLocation = () => {
      const slug = getProjectSlugFromPathname(
        window.location.pathname,
        normalizedBasePath,
      );

      if (slug && projectsBySlug.has(slug)) {
        setSelectedProjectSlug(slug);
        return;
      }

      setSelectedProjectSlug(null);
    };

    syncProjectFromLocation();
    window.addEventListener("popstate", syncProjectFromLocation);

    return () => {
      window.removeEventListener("popstate", syncProjectFromLocation);
    };
  }, [normalizedBasePath, projects]);

  const selectedProject = selectedProjectSlug
    ? (projectsBySlug.get(selectedProjectSlug) ?? null)
    : null;

  const handleProjectNavigate = (
    project: ProjectWithOptimizedImage,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!shouldInterceptNavigation(event)) {
      return;
    }

    event.preventDefault();

    const href = getProjectPath(normalizedBasePath, project.slug);

    if (window.location.pathname !== href) {
      window.history.pushState({ projectSlug: project.slug }, "", href);
    }

    setSelectedProjectSlug(project.slug);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      return;
    }

    const currentSlug = getProjectSlugFromPathname(
      window.location.pathname,
      normalizedBasePath,
    );

    if (currentSlug) {
      setSelectedProjectSlug(null);
      window.history.back();
      return;
    }

    setSelectedProjectSlug(null);
  };

  return (
    <>
      <Tabs defaultValue="all" className="w-full flex flex-col gap-5">
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.slug} value={category.slug}>
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <ProjectGrid
            projects={projects}
            basePath={normalizedBasePath}
            onProjectNavigate={handleProjectNavigate}
          />
        </TabsContent>
        {categories.map((category) => (
          <TabsContent key={category.slug} value={category.slug}>
            <ProjectGrid
              projects={projects.filter(
                (project) => project.category === category.slug,
              )}
              basePath={normalizedBasePath}
              onProjectNavigate={handleProjectNavigate}
            />
          </TabsContent>
        ))}
      </Tabs>

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="p-0 overflow-hidden">
            <ProjectDetailContent
              project={selectedProject}
              imageClassName="rounded-t-2xl"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
