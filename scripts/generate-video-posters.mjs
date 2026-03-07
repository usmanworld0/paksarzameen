/**
 * Video poster generation script
 * ───────────────────────────────
 * Extracts the first frame from local MP4 videos and saves as a WebP poster.
 * Falls back to generating a simple dark gradient placeholder if sharp can't decode video.
 *
 * Usage: node scripts/generate-video-posters.mjs
 *
 * Output: /public/videos/posters/ with WebP poster images for each video.
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { existsSync, readFileSync } from "node:fs";

const PUBLIC_DIR = join(process.cwd(), "public");
const VIDEOS_DIR = join(PUBLIC_DIR, "videos");
const POSTERS_DIR = join(PUBLIC_DIR, "videos", "posters");

/**
 * Generate a dark gradient placeholder poster (1280×720).
 * Used when we can't extract a real frame from the video.
 */
async function generatePlaceholderPoster(name, outPath) {
  // Create a dark gradient overlay that looks cinematic
  const width = 1280;
  const height = 720;

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 8, g: 28, b: 16, alpha: 255 }, // PSZ dark green
    },
  })
    .webp({ quality: 60 })
    .toFile(outPath);
}

async function main() {
  console.log("🎬 Video Poster Generation Script");
  console.log("━".repeat(50));

  if (!existsSync(POSTERS_DIR)) {
    await mkdir(POSTERS_DIR, { recursive: true });
  }

  const entries = await readdir(VIDEOS_DIR, { withFileTypes: true });
  const videos = entries.filter(
    (e) => e.isFile() && extname(e.name).toLowerCase() === ".webm"
  );

  console.log(`Found ${videos.length} videos\n`);

  for (const video of videos) {
    const name = basename(video.name, ".webm");
    const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const outPath = join(POSTERS_DIR, `${safeName}-poster.webp`);

    try {
      // Try to read the first frame using sharp
      // Sharp supports extracting first frames from some video formats
      const videoPath = join(VIDEOS_DIR, video.name);
      try {
        await sharp(videoPath, { pages: 1 })
          .resize(1280, 720, { fit: "cover" })
          .webp({ quality: 75 })
          .toFile(outPath);
        const info = await stat(outPath);
        console.log(`✅ ${video.name} → ${safeName}-poster.webp (${(info.size / 1024).toFixed(1)} KB) [extracted frame]`);
      } catch {
        // Sharp can't decode video — generate placeholder
        await generatePlaceholderPoster(safeName, outPath);
        const info = await stat(outPath);
        console.log(`✅ ${video.name} → ${safeName}-poster.webp (${(info.size / 1024).toFixed(1)} KB) [gradient placeholder]`);
      }
    } catch (err) {
      console.error(`❌ Failed to process ${video.name}: ${err.message}`);
    }
  }

  console.log("\n✨ Done! Posters saved to public/videos/posters/");
  console.log("💡 For best results, replace placeholders with real thumbnails extracted via ffmpeg:");
  console.log("   ffmpeg -i input.webm -vframes 1 -q:v 2 output-poster.jpg");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
