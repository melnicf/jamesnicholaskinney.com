import Link from "next/link";
import {
  Linkedin,
  Youtube,
  Twitter,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/page-container";

const PRIMARY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Appearances", href: "/appearances" },
  { label: "Contact", href: "/contact" },
] as const;

const CATEGORY_LINKS = [
  { label: "Business & Tech", href: "/category/business-tech" },
  { label: "Politics & Policy", href: "/category/politics-policy" },
  { label: "Sports & Entertainment", href: "/category/sports-entertainment" },
  { label: "Arts & Culture", href: "/category/arts-culture" },
] as const;

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "X", href: "https://x.com", icon: Twitter },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
] as const;

function SocialIconLink({
  href,
  icon: Icon,
  label,
}: (typeof SOCIAL_LINKS)[number]) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex size-9 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
      aria-label={label}
    >
      <Icon className="size-5" />
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <PageContainer size="wide" className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Primary nav */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {PRIMARY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Categories
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {CATEGORY_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-300 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio / Admin */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              For Editors
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-300 transition-colors hover:text-white"
                >
                  Studio
                  <ExternalLink className="size-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Follow
            </h3>
            <div className="mt-4 flex gap-1">
              {SOCIAL_LINKS.map((item) => (
                <SocialIconLink key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-8">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} James Nicholas Kinney. All rights
            reserved.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
