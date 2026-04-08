/**
 * Video optimization script
 * ─────────────────────────
 * Compresses local MP4 and WebM videos under /public while preserving filenames.
 * A file is replaced only if the optimized output is smaller.
 *
 * Usage: node scripts/optimize-videos.mjs
 */

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

const PUBLIC_DIR = join(process.cwd(), "public");
const SUPPORTED_EXT = new Set([".mp4", ".webm"]);
const SKIP_DIR_NAMES = new Set(["posters"]);
const MIN_SAVING_RATIO = 0.98; // replace only if new file <= 98% of original

async function collectVideos(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name.toLowerCase())) {
        continue;
      }
      await collectVideos(fullPath, results);
      continue;
    }

    const ext = extname(entry.name).toLowerCase();
    if (SUPPORTED_EXT.has(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `ffmpeg exited with code ${code}`));
      }
    });
  });
}

function buildArgs(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase();
  const scaleFilter = "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease";

  if (ext === ".mp4") {
    return [
      "-y",
      "-i",
      inputPath,
      "-vf",
      scaleFilter,
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "28",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      outputPath,
    ];
  }

  return [
    "-y",
    "-i",
    inputPath,
    "-vf",
    scaleFilter,
    "-c:v",
    "libvpx-vp9",
    "-crf",
    "34",
    "-b:v",
    "0",
    "-c:a",
    "libopus",
    "-b:a",
    "64k",
    outputPath,
  ];
}

async function optimizeVideo(filePath) {
  const tempOutput = `${filePath}.tmp${extname(filePath)}`;
  const before = await stat(filePath);

  try {
    const args = buildArgs(filePath, tempOutput);
    await runFfmpeg(args);

    if (!existsSync(tempOutput)) {
      throw new Error("Optimization output file was not created.");
    }

    const after = await stat(tempOutput);
    const shouldReplace = after.size <= before.size * MIN_SAVING_RATIO;

    if (shouldReplace) {
      await rename(tempOutput, filePath);
      return {
        replaced: true,
        beforeBytes: before.size,
        afterBytes: after.size,
      };
    }

    await unlink(tempOutput);
    return {
      replaced: false,
      beforeBytes: before.size,
      afterBytes: after.size,
    };
  } catch (error) {
    if (existsSync(tempOutput)) {
      await unlink(tempOutput).catch(() => {});
    }
    throw error;
  }
}

function toMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

async function main() {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static binary not found. Install dependency first.");
  }

  console.log("🎞️  Video Optimization Script");
  console.log("━".repeat(50));

  const videos = await collectVideos(PUBLIC_DIR);
  console.log(`Found ${videos.length} videos to evaluate\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  let replacedCount = 0;

  for (const videoPath of videos) {
    try {
      const result = await optimizeVideo(videoPath);
      totalBefore += result.beforeBytes;
      totalAfter += result.replaced ? result.afterBytes : result.beforeBytes;

      if (result.replaced) {
        replacedCount += 1;
        console.log(
          `✅ Optimized: ${videoPath.replace(process.cwd() + "\\", "")}` +
            ` (${toMB(result.beforeBytes)} MB → ${toMB(result.afterBytes)} MB)`
        );
      } else {
        console.log(
          `↩️  Kept original: ${videoPath.replace(process.cwd() + "\\", "")}` +
            ` (${toMB(result.beforeBytes)} MB, optimized was not smaller enough)`
        );
      }
    } catch (err) {
      console.error(`❌ Failed: ${videoPath.replace(process.cwd() + "\\", "")}`);
      console.error(`   ${err.message}`);
    }
  }

  console.log("\n" + "━".repeat(50));
  console.log(`Videos optimized: ${replacedCount}/${videos.length}`);
  console.log(`Total size before: ${toMB(totalBefore)} MB`);
  console.log(`Total size after : ${toMB(totalAfter)} MB`);
  if (totalBefore > 0) {
    const savings = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
    console.log(`Total reduction  : ${savings}%`);
  }
  console.log("✨ Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
