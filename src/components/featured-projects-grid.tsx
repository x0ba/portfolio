import { useEffect, useState, type MouseEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProjectDetailContent, {
  type ProjectWithOptimizedImage,
} from "@/components/project-detail-content";
import { isRouteableProject, type SanityProject } from "@/lib/sanity";
import { SiGithub } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import { useTilt } from "@/lib/tilt";

interface ProjectWithOptionalSlug extends SanityProject {
  optimizedImageUrl: string | null;
}

interface FeaturedProjectsGridProps {
  projects: ProjectWithOptionalSlug[];
  basePath?: string;
}

function isRouteableProjectWithImage(
  project: ProjectWithOptionalSlug,
): project is ProjectWithOptimizedImage {
  return isRouteableProject(project);
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
  project: ProjectWithOptionalSlug;
  href?: string;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const tiltRef = useTilt<HTMLDivElement>(6);

  return (
    <div
      ref={tiltRef}
      className={`group relative rounded-xl border border-border overflow-hidden bg-card hover:border-foreground/20 transition-all duration-300 ${
        href ? "cursor-pointer" : ""
      }`}
    >
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
                className="text-muted-foreground hover:text-foreground transition-colors"
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
                className="text-muted-foreground hover:text-foreground transition-colors"
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

      {href && (
        <a
          href={href}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`View ${project.name} details`}
          onClick={onNavigate}
        >
          <span className="sr-only">View {project.name} details</span>
        </a>
      )}
    </div>
  );
}

export default function FeaturedProjectsGrid({
  projects,
  basePath = "/projects",
}: FeaturedProjectsGridProps) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const routeableProjects = projects.filter(isRouteableProjectWithImage);
  const routeableProjectsBySlug = new Map(
    routeableProjects.map((project) => [project.slug.current, project]),
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

      if (slug && routeableProjectsBySlug.has(slug)) {
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
    ? (routeableProjectsBySlug.get(selectedProjectSlug) ?? null)
    : null;

  const handleProjectNavigate = (
    project: ProjectWithOptimizedImage,
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!shouldInterceptNavigation(event)) {
      return;
    }

    event.preventDefault();

    const href = getProjectPath(normalizedBasePath, project.slug.current);

    if (window.location.pathname !== href) {
      window.history.pushState({ projectSlug: project.slug.current }, "", href);
    }

    setSelectedProjectSlug(project.slug.current);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          if (!isRouteableProjectWithImage(project)) {
            return <ProjectCard key={project._id} project={project} />;
          }

          return (
            <ProjectCard
              key={project._id}
              project={project}
              href={getProjectPath(normalizedBasePath, project.slug.current)}
              onNavigate={(event) => handleProjectNavigate(project, event)}
            />
          );
        })}
      </div>

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
