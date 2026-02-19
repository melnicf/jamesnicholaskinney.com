"use client";

import { usePathname } from "next/navigation";

export function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return <main className="flex flex-1 flex-col">{children}</main>;
}
