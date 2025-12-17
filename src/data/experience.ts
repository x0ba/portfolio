export interface Experience {
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export const experiences: Experience[] = [
  {
    company: "Symphonic Student Association at UCSD",
    position: "Webmaster",
    startYear: "Oct 2025",
    endYear: "Present",
    description:
      "Develop and maintain the club website and membership portal, creating a custom digital ecosystem for club operations.",
  },
  {
    company: "Polylabs Inc.",
    position: "Software Engineer Intern",
    startYear: "Nov 2025",
    endYear: "Present",
    description:
      "Developed AI filter for comments section in a child-focused coding community and other web apps / websites.",
  },
];
