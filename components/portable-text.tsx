import { PortableText as BasePortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

const components = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </p>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mb-4 mt-8 text-2xl font-semibold text-neutral-900 dark:text-white">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-8 text-xl font-semibold text-neutral-900 dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-6 text-lg font-semibold text-neutral-900 dark:text-white">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-4 text-base font-semibold text-neutral-900 dark:text-white">
        {children}
      </h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-4 border-l-4 border-neutral-300 pl-4 italic text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-neutral-700 dark:text-neutral-300">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-neutral-700 dark:text-neutral-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-neutral-900 dark:text-white">
        {children}
      </strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-neutral-900 dark:text-white">{children}</em>
    ),
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/50 underline-offset-2 transition-colors hover:decoration-primary"
      >
        {children}
      </a>
    ),
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
}

export function PortableText({ value }: PortableTextProps) {
  if (!value?.length) return null;
  return (
    <BasePortableText
      value={value}
      components={components as Parameters<typeof BasePortableText>[0]["components"]}
    />
  );
}
