import type { CartItem } from "@/types";

export type ParsedCustomizationValue = {
  value: string;
  label: string;
  image?: string | null;
  priceAdjustment: number;
};

export type ParsedCustomizationGroup = {
  label: string;
  values: ParsedCustomizationValue[];
};

export type ParsedCustomizationOption = {
  id: string;
  name: string;
  required: boolean;
  groups: ParsedCustomizationGroup[];
};

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
      const rawGroups = Array.isArray(option.options) ? option.options : [];
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
        .filter((group) => group.values.length > 0);

      return {
        id: option.id,
        name: option.name,
        required: option.required,
        groups,
      };
    })
    .filter((option) => option.groups.length > 0);
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
