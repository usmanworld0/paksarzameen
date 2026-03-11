import { z } from "zod";

const supportedRegionSchema = z.enum(["PAK", "US", "UK"]);

const optionalText = z.preprocess(
  (value) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  },
  z.string().optional()
);

const optionalPositiveNumber = z.preprocess(
  (value) => {
    if (value === null || value === undefined || value === "") return undefined;
    return value;
  },
  z.coerce.number().positive().optional()
);

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: optionalText,
  image: optionalText,
  customizable: z.boolean().default(false),
});

export const artistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  bio: optionalText,
  location: optionalText,
  profileImage: optionalText,
  socialLinks: z
    .object({
      instagram: optionalText,
      facebook: optionalText,
      website: optionalText,
    })
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: optionalText,
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: optionalPositiveNumber.nullable(),
  availability: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  artistId: z.string().optional().nullable(),
  customizable: z.boolean().default(false),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  regionPrices: z
    .array(
      z.object({
        regionCode: supportedRegionSchema,
        price: z.coerce.number().positive("Regional price must be positive"),
        compareAtPrice: optionalPositiveNumber.nullable(),
      })
    )
    .default([]),
  images: z.array(z.string()).optional(),
});

export const saleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["STORE", "CATEGORY", "PRODUCT"]),
  targetId: z.string().optional().nullable(),
  discountPercent: z.coerce
    .number()
    .min(1, "Minimum 1%")
    .max(100, "Maximum 100%"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
export type ArtistFormData = z.infer<typeof artistSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type SaleFormData = z.infer<typeof saleSchema>;
