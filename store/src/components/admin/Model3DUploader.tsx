"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Box, CheckCircle2, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const RECOMMENDED_MODEL_SIZE_MB = 10;
const CLOUDINARY_FILE_LIMIT_MB = 10;
const AUTO_OPTIMIZE_THRESHOLD_MB = 25;
const TEXTURE_MAX_DIMENSION = 1024;
const TEXTURE_WEBP_QUALITY = 0.72;

async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

async function imageToWebp(
  source: Blob,
  maxDimension: number,
  quality: number
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  const bitmap = await createImageBitmap(source);
  const ratio = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));

  try {
    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(bitmap, 0, 0, width, height);
      const webpBlob = await canvas.convertToBlob({
        type: "image/webp",
        quality,
      });
      return { bytes: await blobToBytes(webpBlob), width, height };
    }

    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(bitmap, 0, 0, width, height);

      const webpBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (result) => resolve(result),
          "image/webp",
          quality
        );
      });

      if (!webpBlob) return null;
      return { bytes: await blobToBytes(webpBlob), width, height };
    }

    return null;
  } finally {
    bitmap.close();
  }
}

async function compressTextures(document: import("@gltf-transform/core").Document): Promise<void> {
  const root = document.getRoot();
  const textures = root.listTextures();

  for (const texture of textures) {
    const image = texture.getImage();
    if (!image || image.byteLength === 0) continue;

    const mimeType = texture.getMimeType() ?? "image/png";
    if (mimeType === "image/ktx2") continue;

    const sourceBlob = new Blob([image], { type: mimeType });
    const compressed = await imageToWebp(
      sourceBlob,
      TEXTURE_MAX_DIMENSION,
      TEXTURE_WEBP_QUALITY
    );

    if (!compressed) continue;
    if (compressed.bytes.byteLength >= image.byteLength) continue;

    texture.setImage(compressed.bytes);
    texture.setMimeType("image/webp");
  }
}

async function optimizeModelBeforeUpload(file: File): Promise<File> {
  const [{ WebIO }, { dedup, prune, quantize, weld }] = await Promise.all([
    import("@gltf-transform/core"),
    import("@gltf-transform/functions"),
  ]);

  const inputBytes = new Uint8Array(await file.arrayBuffer());
  const io = new WebIO();
  const document = await io.readBinary(inputBytes);

  await compressTextures(document);

  // Keep optimization deterministic and browser-compatible.
  await document.transform(
    dedup(),
    prune(),
    weld(),
    quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 })
  );

  const outputBytes = await io.writeBinary(document);
  if (outputBytes.byteLength >= inputBytes.byteLength) {
    return file;
  }

  return new File([outputBytes], file.name, {
    type: "model/gltf-binary",
    lastModified: Date.now(),
  });
}

interface Model3DUploaderProps {
  model3DUrl: string;
  modelSize: number | null;
  modelOptimized: boolean;
  onModelUrlChange: (value: string) => void;
  onModelSizeChange: (value: number | null) => void;
  onModelOptimizedChange: (value: boolean) => void;
}

export function Model3DUploader({
  model3DUrl,
  modelSize,
  modelOptimized,
  onModelUrlChange,
  onModelSizeChange,
  onModelOptimizedChange,
}: Model3DUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const sizeLabel = useMemo(() => {
    if (modelSize === null || modelSize === undefined || Number.isNaN(modelSize)) {
      return "Unknown";
    }

    return `${modelSize.toFixed(2)} MB`;
  }, [modelSize]);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      setWarning(null);

      const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
      if (!file.name.toLowerCase().endsWith(".glb")) {
        setError("Only .glb files are supported.");
        event.target.value = "";
        return;
      }

      let fileToUpload = file;
      if (fileSizeMb > RECOMMENDED_MODEL_SIZE_MB) {
        setOptimizing(true);
        setWarning("Large model detected. Running automatic optimization before upload...");

        try {
          const optimizedFile = await optimizeModelBeforeUpload(file);
          const optimizedSizeMb = Number((optimizedFile.size / (1024 * 1024)).toFixed(2));

          fileToUpload = optimizedFile;
          if (optimizedFile.size < file.size) {
            setWarning(
              `Auto-optimized model from ${fileSizeMb.toFixed(2)}MB to ${optimizedSizeMb.toFixed(2)}MB before upload.`
            );
          } else {
            setWarning(
              "Automatic optimization completed, but no further size reduction was possible for this model."
            );
          }
        } catch {
          setWarning(
            "Automatic optimization failed for this model. Uploading the original file instead."
          );
          fileToUpload = file;
        } finally {
          setOptimizing(false);
        }
      }

      const uploadSizeMb = Number((fileToUpload.size / (1024 * 1024)).toFixed(2));
      if (uploadSizeMb > CLOUDINARY_FILE_LIMIT_MB) {
        setError(
          `File size too large after optimization (${uploadSizeMb.toFixed(2)}MB). Your current Cloudinary plan limit is ${CLOUDINARY_FILE_LIMIT_MB}MB per file. Use gltf-transform/gltf-pipeline with smaller textures and lighter geometry, then upload again.`
        );
        event.target.value = "";
        return;
      }

      if (uploadSizeMb > AUTO_OPTIMIZE_THRESHOLD_MB) {
        setWarning(
          `Model remains very large (${uploadSizeMb.toFixed(2)}MB) even after optimization. Expect slower loading on mobile devices.`
        );
      } else if (uploadSizeMb > RECOMMENDED_MODEL_SIZE_MB) {
        setWarning(
          `Model is ${uploadSizeMb.toFixed(2)}MB. Upload is allowed, but additional optimization is recommended.`
        );
      }

      setUploading(true);

      try {
        const signatureResponse = await fetch("/api/upload/model/signature", {
          method: "POST",
        });

        const signaturePayload = (await signatureResponse.json()) as {
          error?: string;
          signature?: string;
          timestamp?: number;
          folder?: string;
          apiKey?: string;
          cloudName?: string;
          resourceType?: string;
          uniqueFilename?: boolean;
          useFilename?: boolean;
        };

        if (!signatureResponse.ok) {
          throw new Error(signaturePayload.error ?? "Failed to prepare model upload.");
        }

        if (
          !signaturePayload.signature ||
          !signaturePayload.timestamp ||
          !signaturePayload.apiKey ||
          !signaturePayload.cloudName ||
          !signaturePayload.folder
        ) {
          throw new Error("Upload signature response was incomplete.");
        }

        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", fileToUpload);
        cloudinaryFormData.append("api_key", signaturePayload.apiKey);
        cloudinaryFormData.append("timestamp", String(signaturePayload.timestamp));
        cloudinaryFormData.append("signature", signaturePayload.signature);
        cloudinaryFormData.append("folder", signaturePayload.folder);
        cloudinaryFormData.append("resource_type", signaturePayload.resourceType ?? "raw");
        cloudinaryFormData.append(
          "unique_filename",
          String(signaturePayload.uniqueFilename ?? true)
        );
        cloudinaryFormData.append(
          "use_filename",
          String(signaturePayload.useFilename ?? true)
        );

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/raw/upload`,
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );

        const cloudinaryPayload = (await cloudinaryResponse.json()) as {
          secure_url?: string;
          error?: { message?: string };
          bytes?: number;
        };

        if (!cloudinaryResponse.ok || !cloudinaryPayload.secure_url) {
          throw new Error(
            cloudinaryPayload.error?.message ?? "Model upload failed."
          );
        }

        const uploadedModelSizeMb = Number((fileToUpload.size / (1024 * 1024)).toFixed(2));
        onModelUrlChange(cloudinaryPayload.secure_url);
        onModelSizeChange(uploadedModelSizeMb);
        onModelOptimizedChange(uploadedModelSizeMb <= RECOMMENDED_MODEL_SIZE_MB);
        if (uploadedModelSizeMb > RECOMMENDED_MODEL_SIZE_MB) {
          setWarning(
            `Uploaded model is ${uploadedModelSizeMb.toFixed(2)}MB. Keep optimizing for best mobile performance.`
          );
        }
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Model upload failed."
        );
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    },
    [onModelOptimizedChange, onModelSizeChange, onModelUrlChange]
  );

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-neutral-700" />
            <h4 className="text-sm font-semibold text-neutral-900">3D Model</h4>
          </div>
          <p className="mt-1 text-xs leading-6 text-neutral-500">
            Upload a `.glb` file or paste a hosted model URL. Image view remains the default on the product page.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-950">
          {uploading || optimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {optimizing ? "Optimizing..." : uploading ? "Uploading..." : "Upload .glb"}
          <input
            type="file"
            accept=".glb,model/gltf-binary"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading || optimizing}
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-2">
          <Label htmlFor="model3DUrl">Model URL</Label>
          <Input
            id="model3DUrl"
            type="url"
            value={model3DUrl}
            onChange={(event) => onModelUrlChange(event.target.value)}
            placeholder="https://res.cloudinary.com/.../shoe.glb"
          />
          <p className="text-xs text-neutral-400">
            Use Cloudinary raw upload for MVP. External `.glb` URLs also work if CORS is allowed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="modelSize">Model size (MB)</Label>
            <Input
              id="modelSize"
              type="number"
              step="0.01"
              min="0"
              value={modelSize ?? ""}
              onChange={(event) =>
                onModelSizeChange(event.target.value ? Number(event.target.value) : null)
              }
              placeholder="Optional"
            />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="modelOptimized" className="text-sm text-neutral-900">
                  Optimized
                </Label>
                <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                  Flag the model once compression is done.
                </p>
              </div>
              <Switch
                id="modelOptimized"
                checked={modelOptimized}
                onCheckedChange={onModelOptimizedChange}
              />
            </div>
          </div>
        </div>
      </div>

      {model3DUrl ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4" />
          <span>3D model attached.</span>
          <span>Size: {sizeLabel}</span>
        </div>
      ) : null}

      {warning ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-semibold">Optimization recommended</p>
              <p>{warning}</p>
              <p className="mt-1">
                Use `gltf-transform`, `gltf-pipeline`, smaller textures, and lighter geometry before publishing.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
        <span>Recommended: under 10MB.</span>
        <span>Uploads above 10MB are blocked by the current Cloudinary plan limit.</span>
        <span>Supported format: `.glb`.</span>
      </div>

      {model3DUrl ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onModelUrlChange("");
            onModelSizeChange(null);
            onModelOptimizedChange(false);
            setWarning(null);
            setError(null);
          }}
        >
          Remove 3D Model
        </Button>
      ) : null}
    </div>
  );
}
