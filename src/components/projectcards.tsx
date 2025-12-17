import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { projects } from "@/data/projects";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { SiGithub } from "react-icons/si";
import { RiExternalLinkFill } from "react-icons/ri";

const tabs = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "aiml", label: "AI/ML" },
];

export function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Card className="w-full flex flex-col h-full overflow-hidden">
      <img
        src={project.image.src}
        alt={project.name}
        className="w-full h-54 object-cover"
      />
      <CardHeader className="flex flex-col items-start gap-2">
        <CardTitle>{project.name}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 flex-1">
        <p>{project.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap items-center gap-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <div className="flex items-center gap-2">
                <RiExternalLinkFill />
                Demo
              </div>
            </a>
          )}
          {project.code && (
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <div className="flex items-center gap-2">
                <SiGithub />
                Code
              </div>
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ProjectCards() {
  const [tab, setTab] = useState("all");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="w-full flex flex-col gap-4"
    >
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tabItem) => (
        <TabsContent
          key={tabItem.value}
          value={tabItem.value}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects
            .filter((project) =>
              tabItem.value === "all"
                ? true
                : project.category === tabItem.value
            )
            .map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
