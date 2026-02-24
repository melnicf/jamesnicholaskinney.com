/**
 * GROQ queries for James Nicholas Kinney site.
 * Use with the client: client.fetch(ARTICLES_QUERY)
 */

export const ARTICLES_QUERY = `*[_type == "article" && contentState == "published" && defined(slug.current)] | order(publishedAt desc) [0...20] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  category->{ title, "slug": slug.current }
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  body,
  excerpt,
  publishedAt,
  seoTitle,
  seoDescription,
  sourceName,
  sourceUrl,
  category->{ title, "slug": slug.current }
}`;

export const CATEGORIES_QUERY = `*[_type == "category" && defined(slug.current)] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description
}`;

export const ARTICLES_BY_CATEGORY_QUERY = `*[_type == "article" && contentState == "published" && category->slug.current == $categorySlug && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  category->{ title, "slug": slug.current }
}`;

export const EVENTS_BY_CATEGORY_QUERY = `*[_type == "event" && contentState == "published" && category->slug.current == $categorySlug && defined(slug.current)] | order(eventDate asc) {
  _id,
  title,
  "slug": slug.current,
  eventDate,
  location,
  description,
  externalUrl,
  category->{ title, "slug": slug.current }
}`;

export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  body
}`;
