import { defineType, defineField } from "sanity";
import { CalendarIcon } from "@sanity/icons";

const CONTENT_STATES = [
  { title: "Ingested", value: "ingested" },
  { title: "Needs Review", value: "needs_review" },
  { title: "Approved", value: "approved" },
  { title: "Published", value: "published" },
] as const;

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Link to event details or registration",
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
    }),
  ],
});
