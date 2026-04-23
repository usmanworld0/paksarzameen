"use client";

import { useCallback, useMemo, useState } from "react";
import { AlertTriangle, Box, CheckCircle2, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const RECOMMENDED_MODEL_SIZE_MB = 10;
const MAX_MODEL_SIZE_MB = 25;

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

      if (fileSizeMb > MAX_MODEL_SIZE_MB) {
        setError("This 3D model is larger than 25MB. Optimize it before uploading.");
        event.target.value = "";
        return;
      }

      if (fileSizeMb > RECOMMENDED_MODEL_SIZE_MB) {
        setWarning("Large model detected. Upload is allowed, but optimization is strongly recommended.");
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/model", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as {
          url?: string;
          error?: string;
          warning?: string | null;
          modelSize?: number;
          modelOptimized?: boolean;
        };

        if (!response.ok || !payload.url) {
          throw new Error(payload.error ?? "Model upload failed.");
        }

        onModelUrlChange(payload.url);
        onModelSizeChange(payload.modelSize ?? null);
        onModelOptimizedChange(payload.modelOptimized ?? false);
        setWarning(payload.warning ?? null);
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
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload .glb"}
          <input
            type="file"
            accept=".glb,model/gltf-binary"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
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
        <span>Hard limit: 25MB.</span>
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
