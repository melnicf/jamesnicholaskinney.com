import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/ingestion/pipeline";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPipeline();

    return NextResponse.json({
      success: true,
      summary: {
        feeds: result.feeds.length,
        totalNew: result.totalNew,
        totalDuplicate: result.totalDuplicate,
        totalErrored: result.totalErrored,
        duration: `${new Date(result.completedAt).getTime() - new Date(result.startedAt).getTime()}ms`,
      },
      details: result.feeds.map((f) => ({
        feedUrl: f.feedUrl,
        fetched: f.itemsFetched,
        new: f.itemsNew,
        duplicate: f.itemsDuplicate,
        errored: f.itemsErrored,
        errors: f.errors,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Ingestion pipeline failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPipeline();

    return NextResponse.json({
      success: true,
      summary: {
        feeds: result.feeds.length,
        totalNew: result.totalNew,
        totalDuplicate: result.totalDuplicate,
        totalErrored: result.totalErrored,
        duration: `${new Date(result.completedAt).getTime() - new Date(result.startedAt).getTime()}ms`,
      },
      details: result.feeds.map((f) => ({
        feedUrl: f.feedUrl,
        fetched: f.itemsFetched,
        new: f.itemsNew,
        duplicate: f.itemsDuplicate,
        errored: f.itemsErrored,
        errors: f.errors,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Ingestion pipeline failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
