import type { StructureBuilder } from "sanity/structure";
import {
  DocumentTextIcon,
  EditIcon,
  CheckmarkCircleIcon,
  PublishIcon,
  EyeOpenIcon,
  CalendarIcon,
  TagIcon,
  DocumentIcon,
  CogIcon,
} from "@sanity/icons";

function editorialGroup(
  S: StructureBuilder,
  title: string,
  schemaType: string,
  state: string,
  icon: React.ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList(schemaType)
        .title(title)
        .filter(`_type == "${schemaType}" && contentState == $state`)
        .params({ state })
        .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
    );
}

export function deskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Editorial Workflow")
        .icon(EditIcon)
        .child(
          S.list()
            .title("Editorial Workflow")
            .items([
              editorialGroup(
                S,
                "Needs Review",
                "article",
                "needs_review",
                EyeOpenIcon,
              ),
              editorialGroup(
                S,
                "Approved",
                "article",
                "approved",
                CheckmarkCircleIcon,
              ),
              editorialGroup(
                S,
                "Published",
                "article",
                "published",
                PublishIcon,
              ),
              S.divider(),
              editorialGroup(
                S,
                "Ingested (Raw)",
                "article",
                "ingested",
                DocumentTextIcon,
              ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Articles")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("article")
            .title("All Articles")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Events")
        .icon(CalendarIcon)
        .child(
          S.documentTypeList("event")
            .title("All Events")
            .defaultOrdering([{ field: "eventDate", direction: "desc" }]),
        ),

      S.divider(),

      S.listItem()
        .title("Categories")
        .icon(TagIcon)
        .child(S.documentTypeList("category").title("Categories")),

      S.listItem()
        .title("Pages")
        .icon(DocumentIcon)
        .child(S.documentTypeList("page").title("Pages")),

      S.divider(),

      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings")
            .items([
              S.listItem()
                .title("All Documents")
                .child(
                  S.documentList()
                    .title("All Documents")
                    .filter("_type != 'system.group'"),
                ),
            ]),
        ),
    ]);
}
