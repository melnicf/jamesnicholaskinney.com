"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./site-footer";

export function ConditionalSiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <SiteFooter />;
}
