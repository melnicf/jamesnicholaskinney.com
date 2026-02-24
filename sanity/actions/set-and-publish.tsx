"use client";

import { useState, useEffect } from "react";
import { useDocumentOperation } from "sanity";
import { PublishIcon } from "@sanity/icons";
import type { DocumentActionComponent } from "sanity";

/**
 * Wraps Sanity's native publish action to also set contentState → "published"
 * and auto-fill publishedAt if empty. This keeps the editorial workflow
 * consistent without requiring editors to toggle fields manually.
 */
export const SetAndPublishAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [isPublishing, props.draft]);

  const hasContentState = props.type === "article" || props.type === "event";

  return {
    disabled: !!publish.disabled,
    label: isPublishing ? "Publishing…" : "Publish",
    icon: PublishIcon,
    shortcut: "Ctrl+Alt+P",
    tone: "positive" as const,
    onHandle: () => {
      setIsPublishing(true);

      if (hasContentState) {
        const patches: Array<{ set: Record<string, unknown> }> = [
          { set: { contentState: "published" } },
        ];

        const currentPublishedAt =
          props.draft?.publishedAt ?? props.published?.publishedAt;
        if (!currentPublishedAt) {
          patches.push({ set: { publishedAt: new Date().toISOString() } });
        }

        for (const p of patches) {
          patch.execute([p]);
        }
      }

      publish.execute();
    },
  };
};
