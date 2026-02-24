import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

const CONTENT_STATES = [
  { title: "Ingested", value: "ingested" },
  { title: "Needs Review", value: "needs_review" },
  { title: "Approved", value: "approved" },
  { title: "Published", value: "published" },
] as const;

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "editorial", title: "Editorial" },
    { name: "meta", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      group: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "content",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "editorial",
    }),
    defineField({
      name: "contentState",
      title: "Content State",
      type: "string",
      options: {
        list: [...CONTENT_STATES],
        layout: "radio",
      },
      initialValue: "ingested",
      group: "editorial",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      description: "Original source URL for aggregated content",
      group: "editorial",
    }),
    defineField({
      name: "sourceName",
      title: "Source Name",
      type: "string",
      description: "Name of the original publisher",
      group: "editorial",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "meta",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Override the default title for search engines and social sharing",
      group: "meta",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Override the excerpt for search engines and social sharing",
      group: "meta",
    }),
  ],
  orderings: [
    {
      title: "Published date (newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published date (oldest)",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "Title A–Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      state: "contentState",
      category: "category.title",
      date: "publishedAt",
    },
    prepare({ title, state, category, date }) {
      const stateLabel =
        CONTENT_STATES.find((s) => s.value === state)?.title ?? state;
      const dateStr = date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "";
      return {
        title: title ?? "Untitled",
        subtitle: [stateLabel, category, dateStr].filter(Boolean).join(" · "),
      };
    },
  },
});
