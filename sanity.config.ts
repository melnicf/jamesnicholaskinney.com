import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { deskStructure } from "./sanity/desk-structure";
import { SetAndPublishAction } from "./sanity/actions/set-and-publish";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "james-nicholas-kinney",
  title: "James Nicholas Kinney",
  projectId: projectId || "cvjrh10b",
  dataset: dataset || "production",
  basePath: "/studio",
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "article" || context.schemaType === "event") {
        return prev.map((action) =>
          action.action === "publish" ? SetAndPublishAction : action,
        );
      }
      return prev;
    },
  },
});
