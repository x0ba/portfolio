export interface Education {
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
  description?: string;
}

export const education: Education[] = [
  {
    school: "University of California, San Diego",
    degree: "B.S. Mathematics - Computer Science",
    startYear: "2025",
    endYear: "2029",
    description: "Relevant Coursework: Programming in Java, Linear Algebra",
  },
];
