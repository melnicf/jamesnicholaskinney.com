"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { createImageUrlBuilder } from "@sanity/image-url";
import {
  Card,
  Stack,
  Flex,
  Text,
  Checkbox,
  Button,
  Badge,
  Spinner,
  Box,
  Dialog,
} from "@sanity/ui";
import {
  CheckmarkCircleIcon,
  PublishIcon,
  ResetIcon,
  DocumentIcon,
  LinkIcon,
} from "@sanity/icons";

interface ReviewArticle {
  _id: string;
  title: string;
  excerpt?: string;
  sourceName?: string;
  sourceUrl?: string;
  publishedAt?: string;
  contentState: string;
  category?: { title: string };
}

interface ArticlePreview extends ReviewArticle {
  mainImage?: {
    asset?: { _ref?: string; url?: string };
    alt?: string;
  };
  body?: Array<{
    _type: string;
    children?: Array<{ _type: string; text?: string }>;
  }>;
}

function blocksToPlainText(
  blocks: ArticlePreview["body"]
): string {
  if (!blocks?.length) return "";
  return blocks
    .filter((b) => b._type === "block" && b.children)
    .map((b) =>
      (b.children ?? [])
        .map((c) => ("text" in c ? c.text : ""))
        .join("")
    )
    .join("\n\n");
}

const REVIEW_QUERY = `*[_type == "article" && contentState in ["needs_review", "ingested"]] | order(_createdAt desc) [0...100] {
  _id,
  title,
  excerpt,
  sourceName,
  sourceUrl,
  publishedAt,
  contentState,
  category->{ title }
}`;

const PREVIEW_QUERY = `*[_id == $id][0] {
  _id,
  title,
  excerpt,
  mainImage,
  sourceName,
  sourceUrl,
  publishedAt,
  contentState,
  category->{ title },
  body
}`;

export function BulkReviewTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const imageBuilder = useMemo(() => {
    const projectId =
      (typeof client.config === "function"
        ? client.config()?.projectId
        : undefined) ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
      "cvjrh10b";
    const dataset =
      (typeof client.config === "function"
        ? client.config()?.dataset
        : undefined) ?? process.env.NEXT_PUBLIC_SANITY_DATASET ??
      "production";
    return createImageUrlBuilder({ projectId, dataset });
  }, [client]);

  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState("");
  const [previewArticle, setPreviewArticle] = useState<ArticlePreview | null>(
    null
  );
  const [previewLoading, setPreviewLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const results = await client.fetch(REVIEW_QUERY);
      setArticles(results);
      setSelected(new Set());
      setMessage("");
    } catch (err) {
      setMessage(`Error loading articles: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openPreview = useCallback(
    async (id: string) => {
      setPreviewLoading(true);
      setPreviewArticle(null);
      try {
        const doc = await client.fetch<ArticlePreview>(PREVIEW_QUERY, { id });
        setPreviewArticle(doc ?? null);
      } catch (err) {
        setMessage(`Error loading preview: ${err}`);
        setPreviewArticle(null);
      } finally {
        setPreviewLoading(false);
      }
    },
    [client]
  );

  const closePreview = useCallback(() => {
    setPreviewArticle(null);
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === articles.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(articles.map((a) => a._id)));
    }
  };

  const batchUpdate = async (newState: string) => {
    if (selected.size === 0) return;
    setActing(true);
    setMessage("");

    try {
      const tx = client.transaction();
      for (const id of selected) {
        const patches: Record<string, unknown> = { contentState: newState };
        if (newState === "published") {
          const article = articles.find((a) => a._id === id);
          if (!article?.publishedAt) {
            patches.publishedAt = new Date().toISOString();
          }
        }
        tx.patch(id, { set: patches });
      }
      await tx.commit();

      const label =
        newState === "approved"
          ? "approved"
          : newState === "published"
            ? "approved & published"
            : newState;

      setMessage(`${selected.size} article(s) ${label}.`);
      await fetchArticles();
    } catch (err) {
      setMessage(`Error: ${err}`);
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    );
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Text size={3} weight="bold">
            Review Queue ({articles.length})
          </Text>
          <Flex gap={2}>
            <Button
              icon={ResetIcon}
              text="Refresh"
              mode="ghost"
              onClick={fetchArticles}
              disabled={acting}
            />
          </Flex>
        </Flex>

        {message && (
          <Card padding={3} radius={2} tone="positive">
            <Text size={1}>{message}</Text>
          </Card>
        )}

        {articles.length === 0 ? (
          <Card padding={5} radius={2} tone="transparent" border>
            <Flex align="center" justify="center">
              <Text muted>No articles waiting for review.</Text>
            </Flex>
          </Card>
        ) : (
          <>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <Checkbox
                  checked={selected.size === articles.length}
                  indeterminate={
                    selected.size > 0 && selected.size < articles.length
                  }
                  onChange={toggleAll}
                />
                <Text size={1} muted>
                  {selected.size > 0
                    ? `${selected.size} selected`
                    : "Select all"}
                </Text>
              </Flex>
              <Flex gap={2}>
                <Button
                  icon={CheckmarkCircleIcon}
                  text="Approve"
                  tone="positive"
                  mode="ghost"
                  disabled={selected.size === 0 || acting}
                  onClick={() => batchUpdate("approved")}
                />
                <Button
                  icon={PublishIcon}
                  text="Approve & Publish"
                  tone="positive"
                  disabled={selected.size === 0 || acting}
                  onClick={() => batchUpdate("published")}
                />
              </Flex>
            </Flex>

            <Stack space={2}>
              {articles.map((article) => (
                <Card
                  key={article._id}
                  padding={3}
                  radius={2}
                  border
                  tone={selected.has(article._id) ? "primary" : "default"}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleSelect(article._id)}
                >
                  <Flex align="flex-start" gap={3}>
                    <Box style={{ paddingTop: 2 }}>
                      <Checkbox
                        checked={selected.has(article._id)}
                        readOnly
                      />
                    </Box>
                    <Stack space={2} style={{ flex: 1, minWidth: 0 }}>
                      <Flex align="center" justify="space-between" gap={2}>
                        <Text size={1} weight="semibold" style={{ flex: 1 }}>
                          {article.title}
                        </Text>
                        <Box
                          onClick={(e) => e.stopPropagation()}
                          style={{ flexShrink: 0 }}
                        >
                          <Button
                            icon={DocumentIcon}
                            text="Preview"
                            mode="bleed"
                            fontSize={1}
                            disabled={previewLoading}
                            onClick={() => openPreview(article._id)}
                          />
                        </Box>
                      </Flex>
                      <Flex gap={2} wrap="wrap">
                        <Badge
                          tone={
                            article.contentState === "needs_review"
                              ? "caution"
                              : "default"
                          }
                        >
                          {article.contentState === "needs_review"
                            ? "Needs Review"
                            : "Ingested"}
                        </Badge>
                        {article.category && (
                          <Badge>{article.category.title}</Badge>
                        )}
                        {article.sourceName && (
                          <Badge tone="default">{article.sourceName}</Badge>
                        )}
                      </Flex>
                      {article.excerpt && (
                        <Text size={1} muted>
                          {article.excerpt.length > 150
                            ? article.excerpt.slice(0, 150) + "…"
                            : article.excerpt}
                        </Text>
                      )}
                      {article.sourceUrl && (
                        <Text size={0} muted>
                          <a
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: "inherit",
                              textDecoration: "underline",
                            }}
                          >
                            View source
                          </a>
                        </Text>
                      )}
                    </Stack>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>

      {(previewLoading || previewArticle) && (
        <Dialog
          id="article-preview"
          header={previewArticle?.title ?? "Loading…"}
          onClose={closePreview}
          onClickOutside={closePreview}
          footer={
            previewArticle && (
              <Flex gap={2} justify="flex-end">
                <IntentLink
                  intent="edit"
                  params={{ id: previewArticle._id }}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    icon={DocumentIcon}
                    text="Open in editor"
                    tone="primary"
                    as="span"
                  />
                </IntentLink>
                <Button text="Close" mode="ghost" onClick={closePreview} />
              </Flex>
            )
          }
          width={1}
          animate
        >
          {previewLoading ? (
            <Flex align="center" justify="center" padding={5}>
              <Spinner muted />
            </Flex>
          ) : previewArticle ? (
            <Box
              style={{
                maxHeight: "60vh",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <Stack space={4} padding={3}>
                {previewArticle.mainImage?.asset && (
                  <Box
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      overflow: "hidden",
                      backgroundColor: "var(--card-muted-fg-color)",
                    }}
                  >
                    <img
                      src={imageBuilder
                        .image(previewArticle.mainImage)
                        .width(800)
                        .height(450)
                        .fit("max")
                        .url()}
                      alt={previewArticle.mainImage.alt ?? previewArticle.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                )}

                <Flex gap={2} wrap="wrap">
                  <Badge
                    tone={
                      previewArticle.contentState === "needs_review"
                        ? "caution"
                        : "default"
                    }
                  >
                    {previewArticle.contentState === "needs_review"
                      ? "Needs Review"
                      : "Ingested"}
                  </Badge>
                  {previewArticle.category && (
                    <Badge>{previewArticle.category.title}</Badge>
                  )}
                  {previewArticle.sourceName && (
                    <Badge tone="default">{previewArticle.sourceName}</Badge>
                  )}
                </Flex>

                {previewArticle.excerpt && (
                  <Box style={{ marginBottom: 24 }}>
                    <Stack space={2}>
                      <Text size={1} weight="semibold" muted>
                        Excerpt
                      </Text>
                      <Text size={1} style={{ display: "block" }}>
                        {previewArticle.excerpt}
                      </Text>
                    </Stack>
                  </Box>
                )}

                {previewArticle.body && blocksToPlainText(previewArticle.body) && (
                  <Box style={{ marginTop: 8 }}>
                    <Text size={1} weight="semibold" muted>
                      Content
                    </Text>
                    <Text
                      size={1}
                      style={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.6,
                      }}
                    >
                      {blocksToPlainText(previewArticle.body)}
                    </Text>
                  </Box>
                )}

                {previewArticle.sourceUrl && (
                  <Flex gap={2} align="center">
                    <LinkIcon style={{ flexShrink: 0 }} />
                    <a
                      href={previewArticle.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "12px",
                        color: "var(--card-muted-fg-color)",
                        textDecoration: "underline",
                      }}
                    >
                      View original source
                    </a>
                  </Flex>
                )}
              </Stack>
            </Box>
          ) : null}
        </Dialog>
      )}
    </Box>
  );
}
