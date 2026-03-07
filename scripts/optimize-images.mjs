/**
 * Image Optimization Script
 * ─────────────────────────
 * Compresses and converts all local images to optimized WebP format.
 * Generates multiple responsive sizes (small, medium, large) for each image.
 * Also generates tiny blur placeholder base64 strings (LQIP) for each image.
 *
 * Usage: node scripts/optimize-images.mjs
 *
 * Output: /public/images/optimized/ with WebP versions at multiple sizes.
 */

import sharp from "sharp";
import { readdir, stat, mkdir, writeFile, readFile } from "node:fs/promises";
import { join, basename, extname, relative } from "node:path";
import { existsSync } from "node:fs";

const PUBLIC_DIR = join(process.cwd(), "public");
const IMAGES_DIR = join(PUBLIC_DIR, "images");
const OUTPUT_DIR = join(PUBLIC_DIR, "images", "optimized");

/** Responsive breakpoints — width in px */
const SIZES = {
  sm: 480,
  md: 960,
  lg: 1440,
  xl: 1920,
};

/** WebP quality for different use-cases */
const QUALITY = {
  webp: 80,
  avif: 65,
  blur: 20, // tiny LQIP placeholder
};

/** Supported input extensions */
const SUPPORTED_EXT = new Set([".png", ".jpg", ".jpeg"]);

/** Collect all image files recursively */
async function collectImages(dir, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip the optimized output directory
      if (fullPath === OUTPUT_DIR) continue;
      await collectImages(fullPath, results);
    } else if (SUPPORTED_EXT.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Sanitize filename: replace spaces and special chars with hyphens,
 * lowercase everything, strip extension.
 */
function sanitize(name) {
  return basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Given image metadata, determine which sizes to generate.
 * Skip sizes larger than the original to avoid upscaling.
 */
function getTargetSizes(originalWidth) {
  const targets = {};
  for (const [label, width] of Object.entries(SIZES)) {
    if (width <= originalWidth) {
      targets[label] = width;
    }
  }
  // Always include original size as "full"
  targets.full = originalWidth;
  return targets;
}

/** Generate a tiny blur placeholder as a base64 data URI */
async function generateBlurPlaceholder(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(16, undefined, { fit: "inside" })
    .webp({ quality: QUALITY.blur })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString("base64")}`;
}

async function processImage(inputPath) {
  const rel = relative(IMAGES_DIR, inputPath);
  const dirParts = relative(IMAGES_DIR, join(inputPath, ".."));
  const safeName = sanitize(basename(inputPath));
  const outSubDir = join(OUTPUT_DIR, dirParts);

  if (!existsSync(outSubDir)) {
    await mkdir(outSubDir, { recursive: true });
  }

  const metadata = await sharp(inputPath).metadata();
  const originalWidth = metadata.width || 1920;
  const targets = getTargetSizes(originalWidth);
  const results = [];

  for (const [label, width] of Object.entries(targets)) {
    const outName = label === "full" ? `${safeName}.webp` : `${safeName}-${label}.webp`;
    const outPath = join(outSubDir, outName);

    await sharp(inputPath)
      .resize(width, undefined, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(outPath);

    const info = await stat(outPath);
    results.push({
      label,
      width,
      file: outName,
      sizeMB: (info.size / 1024 / 1024).toFixed(2),
    });
  }

  // Generate blur placeholder
  const blurDataURL = await generateBlurPlaceholder(inputPath);

  const originalInfo = await stat(inputPath);
  const originalSizeMB = (originalInfo.size / 1024 / 1024).toFixed(2);

  return {
    source: rel,
    originalSizeMB,
    optimized: results,
    blurDataURL,
  };
}

async function main() {
  console.log("🖼️  Image Optimization Script");
  console.log("━".repeat(50));

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  const images = await collectImages(IMAGES_DIR);
  console.log(`Found ${images.length} images to optimize\n`);

  const manifest = {};
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const imgPath of images) {
    try {
      const result = await processImage(imgPath);
      const rel = result.source;

      console.log(`✅ ${rel}`);
      console.log(`   Original: ${result.originalSizeMB} MB`);

      totalOriginal += parseFloat(result.originalSizeMB);

      const fullSize = result.optimized.find((r) => r.label === "full");
      if (fullSize) {
        totalOptimized += parseFloat(fullSize.sizeMB);
        console.log(`   WebP full: ${fullSize.sizeMB} MB`);
      }

      for (const opt of result.optimized) {
        if (opt.label !== "full") {
          console.log(`   WebP ${opt.label} (${opt.width}px): ${opt.sizeMB} MB`);
        }
      }
      console.log();

      // Build manifest entry keyed by original public path
      const publicPath = `/images/${rel.replace(/\\/g, "/")}`;
      manifest[publicPath] = {
        optimized: {},
        blurDataURL: result.blurDataURL,
      };
      for (const opt of result.optimized) {
        const dirRel = relative(IMAGES_DIR, join(imgPath, ".."))
          .replace(/\\/g, "/");
        const optimizedPublicPath = `/images/optimized/${dirRel ? dirRel + "/" : ""}${opt.file}`;
        manifest[publicPath].optimized[opt.label] = optimizedPublicPath;
      }
    } catch (err) {
      console.error(`❌ Failed to process ${imgPath}: ${err.message}`);
    }
  }

  // Write manifest
  const manifestPath = join(OUTPUT_DIR, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("━".repeat(50));
  console.log(`📊 Total original: ${totalOriginal.toFixed(2)} MB`);
  console.log(`📊 Total WebP (full): ${totalOptimized.toFixed(2)} MB`);
  console.log(`📊 Reduction: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log(`\n📄 Manifest written to: ${relative(process.cwd(), manifestPath)}`);
  console.log("✨ Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
