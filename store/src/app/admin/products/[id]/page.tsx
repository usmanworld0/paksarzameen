import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminDataNotice } from "@/components/admin/AdminDataNotice";
import { ProductForm } from "@/components/admin/ProductForm";
import { getFirstAdminError, safeAdminLoad } from "@/lib/admin-data";
import { getAllStoreRegions } from "@/lib/store-regions";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const [productResult, regionPricesResult, categoriesResult, artistsResult, regions] = await Promise.all([
    safeAdminLoad(
      `product ${params.id}`,
      () =>
        prisma.product.findUnique({
          where: { id: params.id },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            materials: true,
            careInstructions: true,
            heritageStory: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            categoryId: true,
            artistId: true,
            customizable: true,
            featured: true,
            active: true,
            images: {
              select: {
                imageUrl: true,
              },
              orderBy: { position: "asc" },
            },
          },
        }),
      null as {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        materials: string | null;
        careInstructions: string | null;
        heritageStory: string | null;
        price: number;
        compareAtPrice: number | null;
        stock: number;
        categoryId: string;
        artistId: string | null;
        customizable: boolean;
        featured: boolean;
        active: boolean;
        images: Array<{ imageUrl: string }>;
      } | null
    ),
    safeAdminLoad(
      `product ${params.id} regional prices`,
      () =>
        prisma.productRegionPrice.findMany({
          where: { productId: params.id },
          include: { region: true },
        }),
      [] as Array<{
        id: string;
        productId: string;
        regionId: string;
        price: number;
        compareAtPrice: number | null;
        createdAt: Date;
        updatedAt: Date;
        region: {
          id: string;
          code: string;
          name: string;
          currency: string;
          locale: string;
          countryCodes: unknown;
          active: boolean;
          isDefault: boolean;
          createdAt: Date;
          updatedAt: Date;
        };
      }>
    ),
    safeAdminLoad(
      "product categories",
      () => prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      [] as Array<{ id: string; name: string }>
    ),
    safeAdminLoad(
      "product artists",
      () => prisma.artist.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
      [] as Array<{ id: string; name: string }>
    ),
    getAllStoreRegions(),
  ]);
  const pageError = getFirstAdminError(
    productResult.error,
    categoriesResult.error,
    artistsResult.error
  );
  const supportingError = getFirstAdminError(regionPricesResult.error);
  const product = productResult.data
    ? {
        ...productResult.data,
        model3DUrl: null,
        modelOptimized: false,
        modelSize: null,
        regionPrices: regionPricesResult.data,
      }
    : null;

  if (!pageError && !product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <p className="admin-page-subtitle">Catalog</p>
        <h1 className="admin-page-title mt-1">Edit Product</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          {product ? `Update "${product.name}"` : "Product details"}
        </p>
      </div>
      <div className="h-px bg-neutral-100" />
      {pageError || !product ? (
        <AdminDataNotice
          title="Unable to load product"
          message={pageError || "This product could not be loaded right now."}
        />
      ) : (
        <div className="space-y-4">
          {supportingError ? (
            <AdminDataNotice
              title="Some pricing data could not be loaded"
              message={supportingError}
            />
          ) : null}
          <div className="admin-form-card">
            <ProductForm
              product={product}
              categories={categoriesResult.data}
              artists={artistsResult.data}
              regions={regions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
