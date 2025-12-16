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
    <div className="w-1/2 flex flex-col gap-4">
      <div className="font-serif font-semibold text-2xl">Education</div>
      {educations.map((education) => {
        return (
          <Card>
            <CardHeader>
              <CardDescription>{education.dates}</CardDescription>
              <CardTitle>{education.school}</CardTitle>
              <CardDescription>{education.degree}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                {education.description.map((description) => {
                  return <li>{description}</li>;
                })}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
