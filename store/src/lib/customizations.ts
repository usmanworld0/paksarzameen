import type { CartItem } from "@/types";

export type CustomizationFieldType = "select" | "text" | "number" | "textarea" | "image";

export type ParsedCustomizationValue = {
  value: string;
  label: string;
  image?: string | null;
  priceAdjustment: number;
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
