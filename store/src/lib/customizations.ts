import type { CartItem } from "@/types";

export type CustomizationFieldType = "select" | "text" | "number" | "textarea" | "image";

export type ParsedCustomizationValue = {
  value: string;
  label: string;
  image?: string | null;
  priceAdjustment: number;
  layer?: ParsedCustomizationLayer | null;
};

export type ParsedCustomizationLayer = {
  part: string;
  src?: string;
  asset?: string;
  order?: number;
  view?: string;
};

export type ParsedCustomizationGroup = {
  label: string;
  required: boolean;
  fieldType: CustomizationFieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  values: ParsedCustomizationValue[];
};

export type ParsedCustomizationOption = {
  id: string;
  name: string;
  required: boolean;
  fieldType: CustomizationFieldType;
  placeholder?: string;
  min?: number;
  max?: number;
  groups: ParsedCustomizationGroup[];
  coverImage?: string | undefined;
  baseImage?: string | undefined;
};

export type LayeredRendererConfig = {
  enabled: boolean;
  cloudinaryBasePath?: string;
  cloudinaryCloudName?: string;
  defaultView: string;
  fallbackImage?: string;
};

export type LayeredSelection = {
  part: string;
  src: string;
  order: number;
  view: string;
  key: string;
};

type SelectionRecord = {
  value: string;
};

function toFieldType(value: unknown): CustomizationFieldType {
  if (value === "text" || value === "number" || value === "textarea" || value === "image") {
    return value;
  }
  return "select";
}

function toNumericPrice(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function parseLayer(value: unknown): ParsedCustomizationLayer | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const part =
    typeof record.part === "string" && record.part.trim()
      ? record.part.trim()
      : typeof record.layerPart === "string" && record.layerPart.trim()
      ? record.layerPart.trim()
      : "";

  if (!part) return null;

  const src =
    typeof record.src === "string" && record.src.trim()
      ? record.src.trim()
      : typeof record.layerSrc === "string" && record.layerSrc.trim()
      ? record.layerSrc.trim()
      : undefined;

  const asset =
    typeof record.asset === "string" && record.asset.trim()
      ? record.asset.trim()
      : typeof record.layerAsset === "string" && record.layerAsset.trim()
      ? record.layerAsset.trim()
      : undefined;

  const orderRaw =
    record.order ??
    record.layerOrder;
  const order =
    orderRaw !== undefined && orderRaw !== null && Number.isFinite(Number(orderRaw))
      ? Number(orderRaw)
      : undefined;

  const view =
    typeof record.view === "string" && record.view.trim()
      ? record.view.trim()
      : typeof record.layerView === "string" && record.layerView.trim()
      ? record.layerView.trim()
      : undefined;

  return { part, src, asset, order, view };
}

function extractRendererConfig(options: unknown): LayeredRendererConfig {
  if (!options || typeof options !== "object" || Array.isArray(options)) {
    return {
      enabled: false,
      defaultView: "front",
    };
  }

  const config = options as Record<string, unknown>;
  const renderer =
    config.renderer && typeof config.renderer === "object" && !Array.isArray(config.renderer)
      ? (config.renderer as Record<string, unknown>)
      : null;

  if (!renderer) {
    return {
      enabled: false,
      defaultView: "front",
    };
  }

  return {
    enabled: Boolean(renderer.enabled),
    cloudinaryBasePath:
      typeof renderer.cloudinaryBasePath === "string" && renderer.cloudinaryBasePath.trim()
        ? renderer.cloudinaryBasePath.trim()
        : undefined,
    cloudinaryCloudName:
      typeof renderer.cloudinaryCloudName === "string" && renderer.cloudinaryCloudName.trim()
        ? renderer.cloudinaryCloudName.trim()
        : undefined,
    defaultView:
      typeof renderer.defaultView === "string" && renderer.defaultView.trim()
        ? renderer.defaultView.trim()
        : "front",
    fallbackImage:
      typeof renderer.fallbackImage === "string" && renderer.fallbackImage.trim()
        ? renderer.fallbackImage.trim()
        : undefined,
  };
}

function normalizeCloudinaryBasePath(path: string, productId: string) {
  return path
    .replaceAll("{productId}", productId)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function resolveLayerSource(
  layer: ParsedCustomizationLayer,
  productId: string,
  rendererConfig: LayeredRendererConfig
) {
  if (layer.src && (layer.src.startsWith("http") || layer.src.startsWith("/"))) {
    return layer.src;
  }

  const cloudName = rendererConfig.cloudinaryCloudName;
  const basePath = rendererConfig.cloudinaryBasePath;
  if (!cloudName || !basePath || !layer.asset) {
    return "";
  }

  const folder = normalizeCloudinaryBasePath(basePath, productId);
  const assetPath = layer.asset.replace(/^\/+/, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${folder}/${assetPath}`;
}

export function resolveLayeredRendererConfig(
  options: Array<{ options: unknown }>
): LayeredRendererConfig {
  for (const option of options) {
    const config = extractRendererConfig(option.options);
    if (config.enabled) return config;
  }

  return {
    enabled: false,
    defaultView: "front",
  };
}

export function parseCustomizationOptions(
  options: Array<{ id: string; name: string; required: boolean; options: unknown }>
): ParsedCustomizationOption[] {
  return options
    .map((option) => {
      let fieldType: CustomizationFieldType = "select";
      let placeholder: string | undefined;
      let min: number | undefined;
      let max: number | undefined;
      let rawGroups: unknown[] = [];

      if (Array.isArray(option.options)) {
        rawGroups = option.options;
      } else if (
        option.options &&
        typeof option.options === "object" &&
        !Array.isArray(option.options)
      ) {
        const config = option.options as Record<string, unknown>;
        fieldType = toFieldType(config.fieldType);

        if (typeof config.placeholder === "string" && config.placeholder.trim()) {
          placeholder = config.placeholder.trim();
        }

        if (config.min !== undefined && config.min !== null && config.min !== "") {
          const parsedMin = Number(config.min);
          if (Number.isFinite(parsedMin)) min = parsedMin;
        }

        if (config.max !== undefined && config.max !== null && config.max !== "") {
          const parsedMax = Number(config.max);
          if (Number.isFinite(parsedMax)) max = parsedMax;
        }

        if (Array.isArray(config.groups)) {
          rawGroups = config.groups;
        } else if (Array.isArray(config.options)) {
          rawGroups = config.options;
        }
      }

      const groups = rawGroups
        .filter((group) => group && typeof group === "object" && !Array.isArray(group))
        .map((group) => {
          const groupRecord = group as Record<string, unknown>;
          const rawValues = Array.isArray(groupRecord.values)
            ? groupRecord.values
            : [];

          return {
            label:
              typeof groupRecord.label === "string" && groupRecord.label.trim()
                ? groupRecord.label
                : "Option",
            required: Boolean(groupRecord.required),
            fieldType: toFieldType(groupRecord.fieldType),
            placeholder:
              typeof groupRecord.placeholder === "string" && groupRecord.placeholder.trim()
                ? groupRecord.placeholder.trim()
                : undefined,
            min:
              groupRecord.min !== undefined &&
              groupRecord.min !== null &&
              groupRecord.min !== "" &&
              Number.isFinite(Number(groupRecord.min))
                ? Number(groupRecord.min)
                : undefined,
            max:
              groupRecord.max !== undefined &&
              groupRecord.max !== null &&
              groupRecord.max !== "" &&
              Number.isFinite(Number(groupRecord.max))
                ? Number(groupRecord.max)
                : undefined,
            values: rawValues
              .filter(
                (value) => value && typeof value === "object" && !Array.isArray(value)
              )
              .map((value) => {
                const valueRecord = value as Record<string, unknown>;
                const rawValue = String(valueRecord.value ?? "").trim();
                const rawLabel = String(
                  valueRecord.label ?? valueRecord.value ?? ""
                ).trim();

                return {
                  value: rawValue,
                  label: rawLabel,
                  image:
                    typeof valueRecord.image === "string"
                      ? valueRecord.image
                      : null,
                  priceAdjustment: toNumericPrice(valueRecord.priceAdjustment),
                  layer: parseLayer(valueRecord.layer ?? valueRecord),
                };
              })
              .filter((value) => value.value && value.label),
          };
        })
        .filter((group) =>
          group.fieldType === "select" ? group.values.length > 0 : true
        );

      return {
        id: option.id,
        name: option.name,
        required: option.required,
        fieldType,
        placeholder,
        min,
        max,
        groups,
        coverImage:
          option.options && typeof option.options === "object" && !Array.isArray(option.options)
            ? typeof (option.options as Record<string, unknown>).coverImage === "string"
              ? (option.options as Record<string, unknown>).coverImage as string
              : undefined
            : undefined,
        baseImage:
          option.options && typeof option.options === "object" && !Array.isArray(option.options)
            ? typeof (option.options as Record<string, unknown>).baseImage === "string"
              ? (option.options as Record<string, unknown>).baseImage as string
              : undefined
            : undefined,
      };
    })
    .filter((option) =>
      option.fieldType === "select" ? option.groups.length > 0 : true
    );
}

export function getCustomizationTotal(item: CartItem) {
  return (item.customizations ?? []).reduce(
    (sum, customization) => sum + customization.priceAdjustment,
    0
  );
}

export function getCustomizationSummary(item: CartItem) {
  return (item.customizations ?? [])
    .map((customization) => `${customization.groupLabel}: ${customization.valueLabel}`)
    .join(" | ");
}

export function buildLayeredSelectionsFromState(
  parsedOptions: ParsedCustomizationOption[],
  selectedByGroup: Record<string, SelectionRecord>,
  productId: string,
  rendererConfig: LayeredRendererConfig
): LayeredSelection[] {
  return parsedOptions
    .flatMap((option) =>
      option.groups.flatMap((group) => {
        const groupKey = `${option.id}::${group.label}`;
        const selectedValue = (selectedByGroup[groupKey]?.value ?? "").trim();
        if (!selectedValue) return [];

        const parsedValue = group.values.find((value) => value.value === selectedValue);
        if (!parsedValue?.layer) return [];

        const src = resolveLayerSource(parsedValue.layer, productId, rendererConfig);
        if (!src) return [];

        return [
          {
            key: groupKey,
            part: parsedValue.layer.part,
            src,
            order: parsedValue.layer.order ?? 10,
            view: parsedValue.layer.view || rendererConfig.defaultView,
          },
        ];
      })
    )
    .sort((a, b) => a.order - b.order);
}
