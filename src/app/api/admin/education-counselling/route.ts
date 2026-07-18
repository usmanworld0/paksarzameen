import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdminUser } from "@/lib/supabase/authorization";

const STORE_PATH = path.join(process.cwd(), "education-counselling/src/data/db_store.json");

// Safe helper to read the store
function readStore() {
  if (fs.existsSync(STORE_PATH)) {
    try {
      const content = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      console.error("Admin API failed to read store", e);
    }
  }
  // If not found in default dev place, check relative paths
  return null;
}

// Safe helper to write the store
function writeStore(data: any) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  // Protect route
  const admin = await requireAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const store = readStore();
  if (!store) {
    return NextResponse.json(
      { error: "Education counselling database not initialized." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: store });
}

export async function POST(request: Request) {
  // Protect route
  const admin = await requireAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, payload } = body;

    const store = readStore();
    if (!store) {
      return NextResponse.json(
        { error: "Database not found." },
        { status: 404 }
      );
    }

    if (action === "save_universities") {
      store.universities = payload;
      writeStore(store);
      return NextResponse.json({ success: true, message: "Universities updated successfully." });
    }

    if (action === "save_mentors") {
      store.mentors = payload;
      writeStore(store);
      return NextResponse.json({ success: true, message: "Mentors updated successfully." });
    }

    if (action === "save_tutoring") {
      store.tutoring = payload;
      writeStore(store);
      return NextResponse.json({ success: true, message: "Tutoring courses updated successfully." });
    }

    if (action === "save_articles") {
      store.articles = payload;
      writeStore(store);
      return NextResponse.json({ success: true, message: "Announcements updated successfully." });
    }

    if (action === "save_bookings") {
      store.bookings = payload;
      writeStore(store);
      return NextResponse.json({ success: true, message: "Bookings updated successfully." });
    }

    if (action === "check_links") {
      const brokenLinks: Array<{
        university: string;
        linkType: string;
        url: string;
        reason: string;
      }> = [];

      const unis = store.universities || [];

      // Scan links concurrently with a timeout limit
      const scanPromises = unis.flatMap((uni: any) => {
        const links = uni.officialLinks || {};
        return Object.entries(links).map(async ([key, val]: [string, any]) => {
          if (!val || typeof val !== "string" || !val.startsWith("http")) {
            brokenLinks.push({
              university: uni.name,
              linkType: key,
              url: String(val),
              reason: "Invalid URL structure",
            });
            return;
          }

          try {
            // Perform head/get fetch request with abort timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch(val, {
              method: "GET", // Use GET because some servers block HEAD requests
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (res.status >= 400) {
              brokenLinks.push({
                university: uni.name,
                linkType: key,
                url: val,
                reason: `HTTP Error ${res.status}`,
              });
            }
          } catch (e: any) {
            brokenLinks.push({
              university: uni.name,
              linkType: key,
              url: val,
              reason: e.name === "AbortError" ? "Request Timeout (4s)" : e.message || "Failed to reach host",
            });
          }
        });
      });

      // Wait for all link checks to complete
      await Promise.allSettled(scanPromises);

      return NextResponse.json({
        success: true,
        totalChecked: scanPromises.length,
        brokenCount: brokenLinks.length,
        brokenLinks,
      });
    }

    return NextResponse.json({ error: "Invalid action request." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Counselling API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process request." },
      { status: 500 }
    );
  }
}
