"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

export function ConditionalSiteHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <SiteHeader />;
}
