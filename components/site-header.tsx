"use client";

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
  { label: "Speaking", href: "/speaking" },
  { label: "Contact", href: "/contact" },
] as const;

const LOGO_WORDMARK_WHITE = "/logos/SVG/Logo=Kinney-Wordmark-White.svg";

// Nav link base styles + active state (current page stays highlighted)
// When active, override focus styles so focused link doesn’t flash accent/white
function headerLinkClass(active?: boolean) {
  return cn(
    navigationMenuTriggerStyle(),
    "bg-transparent text-neutral-100 transition-colors duration-150 hover:bg-neutral-800 hover:text-white focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
    active &&
      "bg-neutral-800 text-white focus:bg-neutral-800 focus:text-white focus-visible:bg-neutral-800 focus-visible:text-white"
  );
}

// Categories trigger: hover-only, not clickable. Full overrides for dark header.
const categoriesTriggerClass = cn(
  "inline-flex h-9 w-max cursor-default items-center justify-center rounded-md px-4 py-2 text-sm font-medium outline-none transition-colors duration-150",
  "bg-transparent text-neutral-100 hover:bg-neutral-800 hover:text-white",
  "data-[state=open]:bg-neutral-800 data-[state=open]:text-white data-[state=open]:[&>svg]:rotate-180",
  "focus:bg-neutral-800 focus:text-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
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
            pathname.startsWith("/category/") && "bg-neutral-800 text-white"
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
            "min-w-[280px]",
            "border-neutral-800 bg-neutral-900 text-neutral-100",
            "group-data-[viewport=false]/navigation-menu:border-neutral-800 group-data-[viewport=false]/navigation-menu:bg-neutral-900 group-data-[viewport=false]/navigation-menu:text-neutral-100"
          )}
        >
          <ul className="grid w-[280px] gap-1 p-2">
            {CATEGORIES.map((cat) => {
              const isActive = isActivePath(pathname, cat.href);
              return (
                <li key={cat.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={cat.href}
                      className={cn(
                        "block select-none rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors duration-150 hover:bg-neutral-800 hover:text-white focus:bg-neutral-800 focus:text-white focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900",
                        isActive ? "bg-neutral-800 text-white" : "text-neutral-200"
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950">
      {/* Utility bar */}
      <div className="flex h-9 items-center justify-end border-b border-neutral-800 px-4 md:px-6">
        <Link
          href="/studio"
          className="text-xs font-medium text-neutral-400 hover:text-neutral-200"
        >
          Studio
        </Link>
      </div>

      {/* Primary nav */}
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          aria-label="James Nicholas Kinney – Home"
        >
          <Image
            src={LOGO_WORDMARK_WHITE}
            alt="James Nicholas Kinney"
            width={160}
            height={44}
            className="h-9 w-auto"
            priority
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

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-100 hover:bg-neutral-800 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] bg-neutral-950">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              <Link
                href="/"
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-800 hover:text-white",
                  pathname === "/" ? "bg-neutral-800 text-white" : "text-neutral-200"
                )}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
              <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Categories
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = isActivePath(pathname, cat.href);
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={cn(
                      "rounded-md px-3 py-2 pl-6 text-sm hover:bg-neutral-800 hover:text-white",
                      isActive ? "bg-neutral-800 text-white" : "text-neutral-300"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {cat.label}
                  </Link>
                );
              })}
              <span className="mt-2 border-t border-neutral-800 pt-2" />
              {PRIMARY_LINKS.map((item) => {
                const isActive = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm hover:bg-neutral-800 hover:text-white",
                      isActive ? "bg-neutral-800 text-white" : "text-neutral-300"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/studio"
                className="mt-4 rounded-md px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
              >
                Studio
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
