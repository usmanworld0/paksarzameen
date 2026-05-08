# Implementation: Global Media Optimization

## Overview
This pass optimized all local media assets for faster page load and lower transfer sizes across the main site.

## What Was Added
- Added a new script: `scripts/optimize-videos.mjs`
- Added `ffmpeg-static` as a dev dependency in `package.json`
- Added npm script: `optimize:videos`
- Extended npm script: `optimize:all` to include video compression

## Optimization Strategy
### Images
- Existing `scripts/optimize-images.mjs` was run across `public/images/**`
- Generated responsive WebP variants in `public/images/optimized/**`
- Updated/rewrote `public/images/optimized/manifest.json` with optimized mappings and blur placeholders

### Videos
- New `scripts/optimize-videos.mjs` scans `public/**` for `.mp4` and `.webm`
- Uses `ffmpeg-static` (bundled binary, no system ffmpeg required)
- Applies size-focused compression profiles:
  - MP4: H.264 (`libx264`), `crf 28`, `preset veryfast`, `+faststart`
  - WebM: VP9 (`libvpx-vp9`), `crf 34`, `b:v 0`
  - Scale cap: max width `1280` while preserving aspect ratio
- Safety rule: replaces original file only if optimized output is smaller by at least ~2%

## Executed Commands
- `npm install`
- `npm run optimize:all`

## Results
### Images
- Total original: `306.74 MB`
- Total optimized (WebP full variants): `10.87 MB`
- Reduction: `96.5%`

### Videos
- Total original: `1947.65 MB`
- Total optimized: `55.61 MB`
- Reduction: `97.1%`

### Notable Video Reductions
- `public/images/impact/GWR/Largest donation of saplings in 24 hours - Documentary 4k fixed.mp4`: `1305.38 MB -> 30.65 MB`
- `public/images/impact/GWR/Takmeel - Largest saplings word.mp4`: `504.14 MB -> 11.66 MB`
- `public/images/members/IMG_6394.MP4`: `113.93 MB -> 4.45 MB`

## Notes
- `prebuild` remains unchanged to avoid forcing heavy video transcoding on every production build.
- Use `npm run optimize:all` for full media optimization, or run image/video scripts independently as needed.
