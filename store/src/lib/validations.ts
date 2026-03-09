import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  customizable: z.boolean().default(false),
});

export const artistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  categoryId: z.string().min(1, "Category is required"),
  artistId: z.string().optional().nullable(),
  customizable: z.boolean().default(false),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
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
