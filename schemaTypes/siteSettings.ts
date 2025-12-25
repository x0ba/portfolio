import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      description: "The title of your portfolio site",
      initialValue: "Portfolio",
    }),
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
      description: "Upload your resume PDF here",
      options: {
        accept: ".pdf",
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
