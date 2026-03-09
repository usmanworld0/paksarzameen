import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/admin/StatsCard";

export const dynamic = 'force-dynamic';
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Layers,
  Users,
  Tag,
  Star,
  AlertTriangle,
  Plus,
  TrendingUp,
  ArrowRight,
  Clock,
  Eye,
} from "lucide-react";

export default async function AdminDashboard() {
  const [
    totalProducts,
    totalCategories,
    totalArtists,
    totalSales,
    featuredProducts,
    lowStockProducts,
    recentProducts,
    totalValue,
    recentCategories,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.artist.count(),
    prisma.sale.count({ where: { active: true } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.count({ where: { stock: { lt: 5 }, active: true } }),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { category: true, images: { take: 1, orderBy: { position: "asc" } } },
    }),
    prisma.product.aggregate({ _sum: { price: true }, where: { active: true } }),
    prisma.category.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-page-subtitle">Overview</p>
          <h1 className="admin-page-title mt-1">Dashboard</h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Welcome back. Here&apos;s your store at a glance.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-brand-green/20 transition-all hover:bg-brand-green/90 hover:shadow-xl hover:shadow-brand-green/25"
        >
          <Plus className="h-3.5 w-3.5" />
          New Product
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard title="Products" value={totalProducts} icon={Package} />
        <StatsCard title="Categories" value={totalCategories} icon={Layers} variant="gold" />
        <StatsCard title="Artisans" value={totalArtists} icon={Users} />
        <StatsCard title="Active Sales" value={totalSales} icon={Tag} variant="success" />
        <StatsCard title="Featured" value={featuredProducts} icon={Star} variant="gold" />
        <StatsCard
          title="Low Stock"
          value={lowStockProducts}
          icon={AlertTriangle}
          description="< 5 items"
          variant={lowStockProducts > 0 ? "danger" : "default"}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent products */}
        <section className="lg:col-span-2">
          <div className="admin-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green">
                  Catalog
                </p>
                <h2 className="mt-0.5 text-base font-light text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Recent Products
                </h2>
              </div>
              <Link
                href="/admin/products"
                className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-brand-green"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-50">
              {recentProducts.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-5 py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50">
                    <Package className="h-6 w-6 text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-neutral-400">
                    No products yet
                  </p>
                  <Link
                    href="/admin/products/new"
                    className="text-[11px] font-semibold uppercase tracking-wider text-brand-green hover:underline"
                  >
                    Create your first product
                  </Link>
                </div>
              ) : (
                recentProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 sm:px-6 transition-colors hover:bg-neutral-50/70"
                  >
                    <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-100">
                      {product.images[0]?.imageUrl ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-neutral-300">
                          <Package className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-neutral-800 group-hover:text-brand-green transition-colors">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {product.category.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-neutral-800">
                        {formatPrice(product.price)}
                      </p>
                      <p className={`text-[10px] font-medium ${product.stock < 5 ? "text-red-500" : "text-neutral-400"}`}>
                        {product.stock} in stock
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-6">
          {/* Inventory value card */}
          <div className="admin-card overflow-hidden">
            <div className="relative bg-gradient-to-br from-brand-green/[0.04] to-transparent p-5 sm:p-6">
              <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/[0.06]">
                <TrendingUp className="h-5 w-5 text-brand-green/60" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-green">
                Catalog Value
              </p>
              <p className="mt-3 text-3xl font-semibold text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {formatPrice(totalValue._sum.price ?? 0)}
              </p>
              <p className="mt-1.5 text-[11px] text-neutral-400">
                Total value of active products
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="admin-card overflow-hidden">
            <div className="border-b border-neutral-100 px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                Quick Actions
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-neutral-100">
              {[
                { label: "Add Product", href: "/admin/products/new", icon: Package },
                { label: "Add Category", href: "/admin/categories/new", icon: Layers },
                { label: "Add Artisan", href: "/admin/artists/new", icon: Users },
                { label: "Create Sale", href: "/admin/sales/new", icon: Tag },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 bg-white px-3 py-5 text-center transition-all hover:bg-neutral-50 group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green/[0.05] transition-colors group-hover:bg-brand-green/[0.1]">
                    <action.icon className="h-4 w-4 text-brand-green/70" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-500 group-hover:text-neutral-700">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories overview */}
          {recentCategories.length > 0 && (
            <div className="admin-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                  Categories
                </p>
                <Link href="/admin/categories" className="text-[10px] font-semibold uppercase tracking-wider text-neutral-300 hover:text-brand-green transition-colors">
                  All
                </Link>
              </div>
              <div className="divide-y divide-neutral-50">
                {recentCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/admin/categories/${cat.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-neutral-50/70 transition-colors"
                  >
                    <span className="text-[13px] text-neutral-700">{cat.name}</span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-500">
                      {cat._count.products} items
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
