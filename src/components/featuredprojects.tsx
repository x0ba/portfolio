import { projects } from "@/data/projects";
import { ProjectCard } from "./projectcards";
import { ArrowRight } from "lucide-react";

export default function FeaturedProjects() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between font-serif font-semibold text-2xl sm:text-3xl">
        Featured Projects
        <a
          href="/projects"
          className="text-gray-400 font-sans flex items-center gap-1 text-base"
        >
          See all
          <ArrowRight width={20} height={20} />
        </a>
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
