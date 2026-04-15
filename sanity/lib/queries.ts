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
  "imageUrl": mainImage.asset->url,
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
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
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
  "imageUrl": mainImage.asset->url,
  category->{ title, "slug": slug.current }
}`;

export const EVENTS_BY_CATEGORY_QUERY = `*[_type == "event" && category->slug.current == $categorySlug && defined(slug.current)] | order(eventDate asc) {
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

export const THIS_WEEK_ARTICLES_QUERY = `*[_type == "article" && contentState == "published" && defined(slug.current) && publishedAt >= $weekAgo] | order(publishedAt desc) [0...10] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  category->{ title, "slug": slug.current }
}`;

export const UPCOMING_EVENTS_QUERY = `*[_type == "event" && eventDate >= $now && defined(slug.current)] | order(eventDate asc) [0...5] {
  _id,
  title,
  "slug": slug.current,
  eventDate,
  location,
  description,
  externalUrl,
  category->{ title, "slug": slug.current }
}`;

export const FEATURED_AI_ARTICLE_QUERY = `*[_type == "article" && contentState == "published" && defined(slug.current) && (category->slug.current == "business-tech")] | order(publishedAt desc) [0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  category->{ title, "slug": slug.current }
}`;
