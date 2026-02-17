"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
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

const headerLinkClass = cn(
  navigationMenuTriggerStyle(),
  "bg-transparent text-neutral-100 hover:bg-neutral-800 hover:text-white data-[state=open]:bg-neutral-800"
);

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <>
      <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref onClick={onLinkClick}>
          <NavigationMenuLink className={headerLinkClass}>Home</NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger className={headerLinkClass}>
          Categories
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[280px] gap-1 p-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={cat.href}
                    className="block select-none rounded-md px-3 py-2 text-sm font-medium text-neutral-900 outline-none hover:bg-neutral-100 hover:text-neutral-900"
                    onClick={onLinkClick}
                  >
                    {cat.label}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      {PRIMARY_LINKS.map((item) => (
        <NavigationMenuItem key={item.href}>
          <Link href={item.href} legacyBehavior passHref onClick={onLinkClick}>
            <NavigationMenuLink className={headerLinkClass}>
              {item.label}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      ))}
    </>
  );
}

export function SiteHeader() {
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
        <NavigationMenu className="hidden max-w-none flex-1 justify-end md:flex">
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
                  "rounded-md px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white"
                )}
              >
                Home
              </Link>
              <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Categories
              </span>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="rounded-md px-3 py-2 pl-6 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
              <span className="mt-2 border-t border-neutral-800 pt-2" />
              {PRIMARY_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
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
