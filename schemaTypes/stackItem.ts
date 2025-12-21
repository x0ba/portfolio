import { defineField, defineType } from "sanity";

export const stackItem = defineType({
  name: "stackItem",
  title: "Stack Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Technology name (e.g., 'Next.js', 'React')",
    }),
    defineField({
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description:
        "Iconify icon identifier (e.g., 'simple-icons:react', 'simple-icons:nextdotjs'). Browse icons at iconify.design",
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
      title: "name",
      subtitle: "iconName",
    },
  },
});
