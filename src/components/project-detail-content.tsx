import { SiGithub } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import type { RouteableSanityProject } from "@/lib/sanity";

export interface ProjectWithOptimizedImage extends RouteableSanityProject {
  optimizedImageUrl: string | null;
}

interface ProjectDetailContentProps {
  project: ProjectWithOptimizedImage;
  className?: string;
  imageClassName?: string;
  titleAs?: "h1" | "h2";
}

export default function ProjectDetailContent({
  project,
  className,
  imageClassName,
  titleAs = "h2",
}: ProjectDetailContentProps) {
  const Title = titleAs;

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      {project.optimizedImageUrl && (
        <img
          src={project.optimizedImageUrl}
          alt={project.name}
          width={1600}
          height={900}
          className={cn(
            "w-full aspect-video object-cover object-top",
            imageClassName,
          )}
        />
      )}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <Title className="text-xl font-semibold text-foreground font-serif">
            {project.name}
          </Title>
          <div className="flex items-center gap-3 flex-none pt-1">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <RiExternalLinkFill className="w-4 h-4" />
                <span>Visit</span>
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <SiGithub className="w-4 h-4" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md"
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
