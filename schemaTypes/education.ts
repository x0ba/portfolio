import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "school",
      title: "School",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "degree",
      title: "Degree",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startYear",
      title: "Start Year",
      type: "string",
      description: "e.g., '2025'",
    }),
    defineField({
      name: "endYear",
      title: "End Year",
      type: "string",
      description: "e.g., '2029'",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "e.g., relevant coursework",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "school",
      subtitle: "degree",
    },
  },
});
