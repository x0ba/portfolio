import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState } from "react";

const educations = [
  {
    school: "University of California, San Diego",
    degree: "B.S. in Math and Computer Science",
    dates: "2025 - 2029",
    description: ["Minor in Data Science", "CSES, IEEE, ACM"],
  },
];

export default function Education() {
  const [education, setEducation] = useState(false);
  return (
    <div>
      <Tabs defaultValue="experience"></Tabs>
    </div>
  );
}
