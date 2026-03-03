"use client";

import { useState, useCallback, useEffect } from "react";
import { useClient } from "sanity";
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
} from "@sanity/ui";
import {
  CheckmarkCircleIcon,
  PublishIcon,
  ResetIcon,
} from "@sanity/icons";

interface ReviewArticle {
  _id: string;
  title: string;
  excerpt?: string;
  sourceName?: string;
  publishedAt?: string;
  contentState: string;
  category?: { title: string };
}

const REVIEW_QUERY = `*[_type == "article" && contentState in ["needs_review", "ingested"]] | order(_createdAt desc) [0...100] {
  _id,
  title,
  excerpt,
  sourceName,
  publishedAt,
  contentState,
  category->{ title }
}`;

export function BulkReviewTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [articles, setArticles] = useState<ReviewArticle[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [message, setMessage] = useState("");

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
                    <Stack space={2} style={{ flex: 1 }}>
                      <Flex align="center" gap={2}>
                        <Text size={1} weight="semibold">
                          {article.title}
                        </Text>
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
                    </Stack>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}
