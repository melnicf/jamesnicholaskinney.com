import type { PortableTextBlock } from "@portabletext/types";

/**
 * Canonical About page body (Portable Text). Used as the site fallback and
 * synced to Sanity via `pnpm sanity:sync-about`.
 */
export const ABOUT_PAGE_BODY: PortableTextBlock[] = [
  {
    _type: "block",
    _key: "about-p1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p1-a",
        text: "James Nicholas Kinney is a Global Chief AI Officer, an enterprise transformation leader, and a consequential voice at the intersection of artificial intelligence, leadership, and human behavior.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p2-a",
        text: "Currently serving as Global CAIO at ",
        marks: [],
      },
      {
        _type: "span",
        _key: "about-p2-b",
        text: "INVNT",
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: "about-p2-c",
        text: ", James leads the development of next-generation AI platforms and enterprise intelligence systems, including the Event Intelligence Engine designed to transform how organizations predict, execute, and measure real-world experiences through data, machine learning, AI, and live operational insights.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p3-a",
        text: "Prior to this, James was Global Chief People Officer at ",
        marks: [],
      },
      {
        _type: "span",
        _key: "about-p3-b",
        text: "S4 Capital",
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: "about-p3-c",
        text: ", where he oversaw people strategy and operations across 32 countries and helped architect large-scale organizational transformation in a rapidly evolving digital innovation landscape, including winning AI agency of the year. He is widely known as “The Ad Industry’s Therapist” for his unique ability to blend tech, performance, culture, and psychology.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p4",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p4-a",
        text: "James is triple-certified in artificial intelligence with certifications from MIT, Wharton Executive Education, and the Chief Data and AI Officer program at Carnegie Mellon University. His work focuses on practical AI implementation, helping organizations move beyond hype to drive measurable growth, efficiency, and better decision-making.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p5",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p5-a",
        text: "He authored multiple books, including ",
        marks: [],
      },
      {
        _type: "span",
        _key: "about-p5-b",
        text: "SustAIning Leadership",
        marks: ["em"],
      },
      {
        _type: "span",
        _key: "about-p5-c",
        text: " and ",
        marks: [],
      },
      {
        _type: "span",
        _key: "about-p5-d",
        text: "AI + Mental Health",
        marks: ["em"],
      },
      {
        _type: "span",
        _key: "about-p5-e",
        text: ", and is currently developing new work focused on business applications, civic impact, politics, and the future of leadership in an AI-driven world.",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p6",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p6-a",
        text: "As a speaker and advisor, James focuses on three core areas:",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-li1",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-li1-a",
        text: "Human-centered AI strategy and enterprise transformation",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-li2",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-li2-a",
        text: "Mental health and the societal impact of algorithmic systems",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-li3",
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-li3-a",
        text: "Civic leadership and the future of government and governance in an AI-enabled society",
        marks: [],
      },
    ],
  },
  {
    _type: "block",
    _key: "about-p7",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "about-p7-a",
        text: "Through his platform, ",
        marks: [],
      },
      {
        _type: "span",
        _key: "about-p7-b",
        text: "AI for Better",
        marks: ["strong"],
      },
      {
        _type: "span",
        _key: "about-p7-c",
        text: ", he is building new models for legislation, results, and impact.",
        marks: [],
      },
    ],
  },
];
