import { MAIN_SITE_URL } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import type { StorefrontMenuNode, StorefrontNavigationData } from "@/types/storefront";

export function getFallbackStorefrontNavigation(): StorefrontNavigationData {
  return {
    menu: [
      {
        id: "collections",
        label: "Collections",
        href: "/products",
        children: [],
      },
    ],
    actions: [
      { id: "call", label: "Call Us", href: `${MAIN_SITE_URL}/contact`, external: true },
      { id: "wishlist", label: "Wishlist", href: "/customers-art-gallery" },
      { id: "account", label: "Account", href: "/login" },
      { id: "cart", label: "Cart", href: "/cart" },
    ],
  };
}

export async function getStorefrontNavigation(): Promise<StorefrontNavigationData> {
  if (!process.env.DATABASE_URL) {
    return getFallbackStorefrontNavigation();
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true, customizationOptions: true } },
      },
      orderBy: { name: "asc" },
    });

    const categoryNodes: StorefrontMenuNode[] = categories.map((category) => {
      const children: StorefrontMenuNode[] = [
        {
          id: `${category.id}-shop`,
          label: "Shop this category",
          href: `/categories/${category.slug}`,
          description: `${category._count.products} products`,
        },
      ];

      if (category.customizable && category._count.customizationOptions > 0) {
        children.push({
          id: `${category.id}-customize`,
          label: "Customize",
          href: `/customizations/${category.slug}`,
          description: `${category._count.customizationOptions} options`,
        });
      }

      return {
        id: category.id,
        label: category.name,
        href: `/categories/${category.slug}`,
        previewImage: category.image,
        description: `${category._count.products} products`,
        children,
      };
    });

    return {
      menu: [
        {
          id: "collections",
          label: "Collections",
          href: "/products",
          children: categoryNodes,
        },
      ],
      actions: [
        { id: "call", label: "Call Us", href: `${MAIN_SITE_URL}/contact`, external: true },
        { id: "wishlist", label: "Wishlist", href: "/customers-art-gallery" },
        { id: "account", label: "Account", href: "/login" },
        { id: "cart", label: "Cart", href: "/cart" },
      ],
    };
  } catch {
    return getFallbackStorefrontNavigation();
  }
}
