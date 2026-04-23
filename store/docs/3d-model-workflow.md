# 3D Model Workflow

This store now supports optional `.glb` product models through the `Product` schema fields:

- `model3DUrl`
- `modelOptimized`
- `modelSize`

The storefront keeps image view as the default and only loads the 3D viewer after the shopper selects `3D View`.

## Upload Rules

- Recommended publish size: under `10MB`
- Auto-compression runs before upload for any file over `10MB`
- Upload proceeds only if optimized output is within the Cloudinary account file limit (currently `10MB`)
- If still over limit after optimization, upload is blocked with optimization guidance
- Accepted format: `.glb`

Current in-app compression pass includes:

- Texture downscaling to `1024px` max dimension
- Texture re-encode to `WebP`
- Geometry quantization and cleanup transforms (`dedup`, `prune`, `weld`, `quantize`)

## Storage Strategy

### Phase 1 (MVP)

- Store optimized `.glb` files in Cloudinary using `resource_type: "raw"`
- Publish only optimized models whenever possible
- Keep `modelSize` in MB so merchandising/admin users can review asset weight quickly

### Phase 2 (Scaling)

- Move heavier or high-volume 3D assets to Amazon S3 or Cloudflare R2
- Keep the app storage-agnostic by continuing to save only the final asset URL in `model3DUrl`
- Put a CDN in front of large model files and keep image fallbacks on the PDP

## Optimization Goal

For web commerce, the practical target is to reduce large source models from roughly `25MB` to under `8MB` before publishing.

To get there:

- Reduce texture resolution first, especially `4K` maps down to `1K` or `2K`
- Remove hidden/internal geometry that never contributes to the final silhouette
- Simplify overly dense meshes before shipping
- Compress geometry and textures after cleanup

## Recommended Tooling

Official sources:

- glTF Transform: https://gltf-transform.dev/
- gltf-pipeline: https://github.com/CesiumGS/gltf-pipeline

Install:

```bash
npm install --global @gltf-transform/cli gltf-pipeline
```

## Example Commands

### Quick optimization pass

Uses the official `optimize` command from glTF Transform and converts textures to WebP:

```bash
gltf-transform optimize input.glb output-optimized.glb --texture-compress webp
```

### Draco geometry compression

Official glTF Transform example:

```bash
gltf-transform draco input.glb output-draco.glb --method edgebreaker
```

Official `gltf-pipeline` example:

```bash
gltf-pipeline -i input.glb -o output-draco.glb -d
```

### Texture downsizing

Resize oversized textures to a mobile-friendly baseline:

```bash
gltf-transform resize input.glb output-1024.glb --width 1024 --height 1024
```

### Texture compression

Compress color textures to WebP:

```bash
gltf-transform webp output-1024.glb output-1024-webp.glb --slots "baseColor"
```

For more aggressive GPU-focused texture compression, glTF Transform also documents KTX2 pipelines:

```bash
gltf-transform uastc input.glb output-uastc.glb --slots "{normalTexture,occlusionTexture,metallicRoughnessTexture}" --level 4 --rdo --rdo-lambda 4 --zstd 18 --verbose
gltf-transform etc1s output-uastc.glb output-final.glb --quality 255 --verbose
```

## Mesh Simplification

glTF Transform supports direct CLI simplification. It targets a vertex ratio while keeping error bounded, and its own CLI help recommends welding when simplifying.

Example:

```bash
gltf-transform simplify input.glb output-simplified.glb --ratio 0.5 --error 0.001
```

Practical guidance:

- Start around `ratio: 0.75` for minor cleanup
- Try `ratio: 0.5` for heavier ecommerce optimization
- Keep error thresholds conservative so silhouette quality does not collapse
- Keep `weld` enabled when using `gltf-transform optimize`

If the model is still too large after texture cleanup and Draco compression, simplify the mesh before the final compression pass.

## Suggested Publish Pipeline

For a heavy source file:

1. Resize textures to `1024`
2. Convert large color textures to WebP
3. Simplify unnecessary geometry
4. Run Draco compression
5. Recheck final size and keep it under `8MB` when possible

Example sequence:

```bash
gltf-transform resize source.glb step-1.glb --width 1024 --height 1024
gltf-transform webp step-1.glb step-2.glb --slots "baseColor"
gltf-transform simplify step-2.glb step-3.glb --ratio 0.5 --error 0.001
gltf-transform draco step-3.glb step-4.glb --method edgebreaker
```

You can also combine several steps in one pass:

```bash
gltf-transform optimize source.glb product-web.glb --compress draco --texture-compress webp --texture-size 1024 --simplify-ratio 0.5
```
