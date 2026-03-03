import { defineType, defineField } from "sanity";
import { LinkIcon } from "@sanity/icons";

export const feedSource = defineType({
  name: "feedSource",
  title: "Feed Source",
  type: "document",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Human-readable name for this feed (e.g. 'Reuters Business')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Feed URL",
      type: "url",
      description: "RSS or Atom feed URL",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Default Category",
      type: "reference",
      to: [{ type: "category" }],
      description:
        "Fallback category when AI categorization is uncertain. Leave empty to rely on AI.",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      description: "Only active feeds are ingested",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "url",
      active: "active",
    },
    prepare({ title, subtitle, active }) {
      return {
        title: `${active === false ? "[Inactive] " : ""}${title ?? "Untitled Feed"}`,
        subtitle: subtitle ?? "",
      };
    },
  },
});
