import { defineField, defineType } from "sanity";

export const doohickey = defineType({
  name: "doohickey",
  title: "Doohickey",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "A short, casual blurb about what this thing does (or doesn't do)",
    }),
    defineField({
      name: "emoji",
      title: "Emoji",
      type: "string",
      description: "Pick an emoji that vibes with this doohickey",
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "vibe",
      title: "Vibe",
      type: "string",
      description: "How's it going?",
      options: {
        list: [
          { title: "works, probably", value: "works-probably" },
          { title: "surprisingly useful", value: "surprisingly-useful" },
          { title: "use at own risk", value: "use-at-own-risk" },
          { title: "it's a vibe", value: "its-a-vibe" },
          { title: "abandoned but loved", value: "abandoned-but-loved" },
        ],
      },
      initialValue: "works-probably",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "Where to find/use the thing",
    }),
    defineField({
      name: "code",
      title: "Code",
      type: "url",
      description: "Source code, if it exists",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "vibe",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle?.replace(/-/g, " ") ?? "",
      };
    },
  },
});
