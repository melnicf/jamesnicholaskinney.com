"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Business & Tech", href: "/category/business-tech" },
  { label: "Politics & Policy", href: "/category/politics-policy" },
  { label: "Sports & Entertainment", href: "/category/sports-entertainment" },
  { label: "Arts & Culture", href: "/category/arts-culture" },
] as const;

const PRIMARY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Appearances", href: "/appearances" },
  { label: "Contact", href: "/contact" },
] as const;

const LOGO_WORDMARK_COLOR = "/logos/SVG/Logo=Kinney-Wordmark-Color.svg";
const LOGO_WORDMARK_WHITE = "/logos/SVG/Logo=Kinney-Wordmark-White.svg";
const LOGO_K_ARROWS_COLOR = "/logos/SVG/Kinney-K-Arrows-Color.svg";
const LOGO_K_ARROWS_WHITE = "/logos/SVG/Kinney-K-Arrows-White.svg";
const SCROLL_THRESHOLD = 50;

// Nav link base styles + active state (current page stays highlighted).
// When active, override focus styles so focused link doesn't flash accent.
function headerLinkClass(active?: boolean) {
  return cn(
    navigationMenuTriggerStyle(),
    "bg-transparent text-neutral-700 transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-white",
    active &&
      "bg-neutral-100 text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 focus-visible:bg-neutral-100 focus-visible:text-neutral-900 dark:bg-neutral-800 dark:text-white dark:focus:bg-neutral-800 dark:focus:text-white dark:focus-visible:bg-neutral-800 dark:focus-visible:text-white"
  );
}

// Categories trigger: hover-only, not clickable. Theme-aware overrides.
const categoriesTriggerClass = cn(
  "inline-flex h-9 w-max cursor-default items-center justify-center rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors duration-150",
  "bg-transparent text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
  "dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-white",
  "data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 data-[state=open]:[&>svg]:rotate-180",
  "dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-white",
  "focus:bg-neutral-100 focus:text-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "dark:focus:bg-neutral-800 dark:focus:text-white"
);

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild>
          <Link
            href="/"
            className={headerLinkClass(isActivePath(pathname, "/"))}
            onClick={onLinkClick}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className={cn(
            categoriesTriggerClass,
            pathname.startsWith("/category/") &&
              "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
          )}
          disableDefaultStyle
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Categories
        </NavigationMenuTrigger>
        <NavigationMenuContent
          className={cn(
            "border-border bg-popover text-popover-foreground",
            "group-data-[viewport=false]/navigation-menu:border-border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground"
          )}
        >
          <ul className="grid gap-1 p-2 *:whitespace-nowrap">
            {CATEGORIES.map((cat) => {
              const isActive = isActivePath(pathname, cat.href);
              return (
                <li key={cat.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={cat.href}
                      className={cn(
                        "block select-none rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-150",
                        "hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900",
                        "dark:hover:bg-neutral-800 dark:hover:text-white dark:focus:bg-neutral-800 dark:focus:text-white",
                        "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isActive
                          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-200"
                      )}
                      onClick={onLinkClick}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {cat.label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {PRIMARY_LINKS.map((item) => (
        <NavigationMenuItem key={item.href}>
          <NavigationMenuLink asChild>
            <Link
              href={item.href}
              className={headerLinkClass(isActivePath(pathname, item.href))}
              onClick={onLinkClick}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="relative flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="James Nicholas Kinney – Home"
        >
          {/* Wordmark — color in light theme, white in dark */}
          <Image
            src={LOGO_WORDMARK_COLOR}
            alt="James Nicholas Kinney"
            width={160}
            height={44}
            className={cn(
              "h-9 w-auto transition-all duration-300 ease-in-out dark:hidden",
              scrolled
                ? "pointer-events-none max-w-0 opacity-0"
                : "max-w-[160px] opacity-100"
            )}
            priority
          />
          <Image
            src={LOGO_WORDMARK_WHITE}
            alt="James Nicholas Kinney"
            width={160}
            height={44}
            className={cn(
              "hidden h-9 w-auto transition-all duration-300 ease-in-out dark:block",
              scrolled
                ? "pointer-events-none max-w-0 opacity-0"
                : "max-w-[160px] opacity-100"
            )}
            priority
          />
          {/* K-Arrows — color in light theme, white in dark */}
          <Image
            src={LOGO_K_ARROWS_COLOR}
            alt="James Nicholas Kinney"
            width={36}
            height={36}
            className={cn(
              "h-8 w-auto transition-all duration-300 ease-in-out dark:hidden",
              scrolled
                ? "max-w-[36px] opacity-100"
                : "pointer-events-none max-w-0 opacity-0"
            )}
          />
          <Image
            src={LOGO_K_ARROWS_WHITE}
            alt="James Nicholas Kinney"
            width={36}
            height={36}
            className={cn(
              "hidden h-8 w-auto transition-all duration-300 ease-in-out dark:block",
              scrolled
                ? "max-w-[36px] opacity-100"
                : "pointer-events-none max-w-0 opacity-0"
            )}
          />
        </Link>

        {/* Desktop nav */}
        <NavigationMenu
          className="hidden max-w-none flex-1 justify-end md:flex"
          viewport={false}
        >
          <NavigationMenuList className="gap-1 bg-transparent">
            <NavLinks />
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-accent"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                <Link
                  href="/"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                    pathname === "/"
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-700 dark:text-neutral-200"
                  )}
                  aria-current={pathname === "/" ? "page" : undefined}
                >
                  Home
                </Link>
                <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </span>
                {CATEGORIES.map((cat) => {
                  const isActive = isActivePath(pathname, cat.href);
                  return (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className={cn(
                        "rounded-md px-3 py-2 pl-6 text-sm",
                        "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                        isActive
                          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {cat.label}
                    </Link>
                  );
                })}
                <span className="mt-2 border-t border-border pt-2" />
                {PRIMARY_LINKS.map((item) => {
                  const isActive = isActivePath(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm",
                        "hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
                        isActive
                          ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
