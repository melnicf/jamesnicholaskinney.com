import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const SLUG_PAGE_MAP: Record<string, string> = {
  about: "/about",
  contact: "/contact",
  books: "/books",
  appearances: "/appearances",
};

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string } | string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body._type;
  const slug =
    typeof body.slug === "string" ? body.slug : body.slug?.current;

  const revalidated: string[] = [];

  switch (type) {
    case "article": {
      if (slug) {
        revalidatePath(`/article/${slug}`);
        revalidated.push(`/article/${slug}`);
      }
      break;
    }
    case "category": {
      revalidatePath("/category/[slug]", "page");
      revalidated.push("/category/[slug]");
      revalidatePath("/");
      revalidated.push("/");
      break;
    }
    case "event": {
      revalidatePath("/category/[slug]", "page");
      revalidated.push("/category/[slug]");
      break;
    }
    case "page": {
      if (slug && slug in SLUG_PAGE_MAP) {
        revalidatePath(SLUG_PAGE_MAP[slug]);
        revalidated.push(SLUG_PAGE_MAP[slug]);
      }
      break;
    }
    default: {
      revalidatePath("/", "layout");
      revalidated.push("/ (full)");
    }
  }

  return NextResponse.json({ revalidated, now: Date.now() });
}
