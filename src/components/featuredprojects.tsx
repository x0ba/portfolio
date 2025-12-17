import { projects } from "@/data/projects";
import { ProjectCard } from "./projectcards";

export default function FeaturedProjects() {
  return (
    <div className="flex flex-col gap-4">
      <div className="font-serif font-semibold text-2xl sm:text-3xl">
        Featured Projects
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects
          .filter((project) => project.featured)
          .map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
      </div>
    </div>
  );
}
