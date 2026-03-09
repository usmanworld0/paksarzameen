import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = 'force-dynamic';
import {
  Package,
  Layers,
  Users,
  Tag,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ShoppingCart,
  DollarSign,
  Percent,
  Archive,
} from "lucide-react";

export default async function AnalyticsPage() {
  const [
    products,
    categories,
    artists,
    sales,
    orders,
    customers,
    lowStockProducts,
    outOfStockProducts,
    activeSales,
  ] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        active: true,
        featured: true,
        categoryId: true,
        artistId: true,
        createdAt: true,
      },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
    prisma.artist.findMany({
      include: { _count: { select: { products: true } } },
    }),
    prisma.sale.findMany(),
    prisma.order.findMany({
      select: {
        id: true,
        total: true,
        subtotal: true,
        discount: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.customer.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.sale.count({
      where: { active: true, endDate: { gte: new Date() } },
    }),
  ]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const avgPrice =
    totalProducts > 0
      ? products.reduce((s, p) => s + p.price, 0) / totalProducts
      : 0;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  // Products per category
  const categoriesWithCounts = categories
    .map((c) => ({ name: c.name, count: c._count.products }))
    .sort((a, b) => b.count - a.count);

  // Top artisans by product count
  const topArtists = artists
    .map((a) => ({ name: a.name, count: a._count.products }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Sale type breakdown
  const salesByType = {
    STORE: sales.filter((s) => s.type === "STORE").length,
    CATEGORY: sales.filter((s) => s.type === "CATEGORY").length,
    PRODUCT: sales.filter((s) => s.type === "PRODUCT").length,
  };

  // Price distribution
  const priceRanges = [
    { label: "Under ₨1,000", count: products.filter((p) => p.price < 1000).length },
    { label: "₨1,000 – ₨5,000", count: products.filter((p) => p.price >= 1000 && p.price < 5000).length },
    { label: "₨5,000 – ₨20,000", count: products.filter((p) => p.price >= 5000 && p.price < 20000).length },
    { label: "₨20,000+", count: products.filter((p) => p.price >= 20000).length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="admin-page-subtitle">Insights</p>
        <h1 className="admin-page-title mt-1">Analytics</h1>
        <p className="mt-1.5 text-sm text-neutral-400">
          Overview of your store performance and inventory
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          variant="green"
        />
        <MetricCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Orders"
          value={totalOrders.toString()}
          sub={`${pendingOrders} pending`}
          variant="gold"
        />
        <MetricCard
          icon={<Package className="h-5 w-5" />}
          label="Products"
          value={totalProducts.toString()}
          sub={`${activeProducts} active`}
          variant="default"
        />
        <MetricCard
          icon={<Users className="h-5 w-5" />}
          label="Customers"
          value={customers.toString()}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Health */}
        <div className="admin-card p-6 space-y-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-neutral-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Inventory Health
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <MiniStat label="Avg. Price" value={formatPrice(avgPrice)} />
            <MiniStat label="Catalog Value" value={formatPrice(totalValue)} />
            <MiniStat
              label="Low Stock"
              value={lowStockProducts.toString()}
              alert={lowStockProducts > 0}
            />
            <MiniStat
              label="Out of Stock"
              value={outOfStockProducts.toString()}
              alert={outOfStockProducts > 0}
            />
          </div>

          <div className="h-px bg-neutral-100" />

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
              Price Distribution
            </h3>
            <div className="space-y-2">
              {priceRanges.map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500 w-32 shrink-0">{r.label}</span>
                  <div className="flex-1 h-6 bg-neutral-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-green/20"
                      style={{
                        width: `${totalProducts > 0 ? (r.count / totalProducts) * 100 : 0}%`,
                        minWidth: r.count > 0 ? "24px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-600 w-8 text-right">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Breakdown */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-neutral-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Sales &amp; Promotions
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Total Sales</span>
              <span className="text-sm font-semibold text-neutral-800">{sales.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Active Now</span>
              <span className="text-sm font-semibold text-brand-green">{activeSales}</span>
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">By Type</h3>
            <div className="space-y-2">
              <TypeBar label="Store-wide" count={salesByType.STORE} total={sales.length} />
              <TypeBar label="Category" count={salesByType.CATEGORY} total={sales.length} />
              <TypeBar label="Product" count={salesByType.PRODUCT} total={sales.length} />
            </div>
          </div>

          <div className="h-px bg-neutral-100" />

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Featured Products</span>
                <span className="font-medium text-neutral-700">{featuredProducts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Avg. Order Value</span>
                <span className="font-medium text-neutral-700">{formatPrice(avgOrderValue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products per Category */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Products by Category
          </h2>
          {categoriesWithCounts.length === 0 ? (
            <p className="text-sm text-neutral-400">No categories yet</p>
          ) : (
            <div className="space-y-2">
              {categoriesWithCounts.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-brand-green/60 shrink-0" />
                  <span className="text-sm text-neutral-700 flex-1 truncate">{c.name}</span>
                  <div className="w-24 h-5 bg-neutral-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-green/25"
                      style={{
                        width: `${totalProducts > 0 ? (c.count / totalProducts) * 100 : 0}%`,
                        minWidth: c.count > 0 ? "16px" : "0",
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-neutral-600 w-6 text-right">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Artisans */}
        <div className="admin-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Top Artisans
          </h2>
          {topArtists.length === 0 ? (
            <p className="text-sm text-neutral-400">No artisans yet</p>
          ) : (
            <div className="space-y-3">
              {topArtists.map((a, i) => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900/5 text-xs font-bold text-neutral-700">
                    {i + 1}
                  </span>
                  <span className="text-sm text-neutral-700 flex-1 truncate">{a.name}</span>
                  <span className="text-xs font-medium text-neutral-500">{a.count} products</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  variant?: "default" | "green" | "gold";
}) {
  const bg =
    variant === "green"
      ? "stat-card-green"
      : variant === "gold"
        ? "stat-card-gold"
        : "";
  return (
    <div className={`admin-card p-5 ${bg}`}>
      <div className="flex items-center gap-2 text-neutral-400 mb-2">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </p>
      {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-lg bg-neutral-50 p-3 text-center">
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${alert ? "text-red-500" : "text-neutral-800"}`}>
        {value}
      </p>
    </div>
  );
}

function TypeBar({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-neutral-500 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-neutral-50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-neutral-900/20"
          style={{ width: `${pct}%`, minWidth: count > 0 ? "16px" : "0" }}
        />
      </div>
      <span className="text-xs font-medium text-neutral-600 w-4 text-right">{count}</span>
    </div>
  );
}
