import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ReactNode } from "react";

const tabs = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "aiml", label: "AI/ML" },
];

interface ProjectTabsProps {
  all?: ReactNode;
  web?: ReactNode;
  aiml?: ReactNode;
}

export default function ProjectTabs({ all, web, aiml }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-4">
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value="all"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {all}
      </TabsContent>
      <TabsContent
        value="web"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {web}
      </TabsContent>
      <TabsContent
        value="aiml"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {aiml}
      </TabsContent>
    </Tabs>
  );
}
