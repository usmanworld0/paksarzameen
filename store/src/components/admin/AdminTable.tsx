"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "gold";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  kind?: "text" | "badge" | "image";
  sortable?: boolean;
  searchable?: boolean;
  badgeVariantMap?: Record<string, BadgeVariant>;
  className?: string;
}

interface AdminTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  editPath: string;
  deleteAction?: (id: string) => Promise<void>;
  pageSize?: number;
  searchPlaceholder?: string;
  exportFilename?: string;
}

type SortDir = "asc" | "desc";

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  editPath,
  deleteAction,
  pageSize = 10,
  searchPlaceholder = "Search...",
  exportFilename = "export",
}: AdminTableProps<T>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Searchable keys
  const searchableKeys = useMemo(
    () =>
      columns
        .filter((c) => c.searchable !== false && c.kind !== "image")
        .map((c) => c.key),
    [columns]
  );

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) =>
      searchableKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [data, search, searchableKeys]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = String(a[sortKey as keyof T] ?? "");
      const bVal = String(b[sortKey as keyof T] ?? "");
      const numA = parseFloat(aVal.replace(/[^0-9.-]/g, ""));
      const numB = parseFloat(bVal.replace(/[^0-9.-]/g, ""));
      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [filtered, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = sorted.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Reset page on search
  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      setCurrentPage(1);
    },
    []
  );

  // Sort toggle
  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  // Selection
  const allOnPageSelected =
    paginated.length > 0 && paginated.every((item) => selected.has(item.id));

  function toggleSelectAll() {
    if (allOnPageSelected) {
      const next = new Set(selected);
      paginated.forEach((item) => next.delete(item.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      paginated.forEach((item) => next.add(item.id));
      setSelected(next);
    }
  }

  function toggleSelectOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  // Delete
  async function handleDelete(id: string) {
    if (!deleteAction) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setDeletingId(id);
    try {
      await deleteAction(id);
      selected.delete(id);
      setSelected(new Set(selected));
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  // Bulk delete
  async function handleBulkDelete() {
    if (!deleteAction || selected.size === 0) return;
    if (
      !window.confirm(`Delete ${selected.size} selected item(s)?`)
    )
      return;
    const ids = Array.from(selected);
    for (let i = 0; i < ids.length; i++) {
      await deleteAction(ids[i]);
    }
    setSelected(new Set());
    router.refresh();
  }

  // Export CSV
  function handleExport() {
    const textCols = columns.filter((c) => c.kind !== "image");
    const header = textCols.map((c) => c.label).join(",");
    const rows = sorted.map((item) =>
      textCols
        .map((c) => {
          const val = String(item[c.key] ?? "").replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderValue(col: Column<T>, item: T) {
    const value = item[col.key];

    if (col.kind === "image") {
      const imageSrc = typeof value === "string" ? value : "";
      if (!imageSrc) {
        return (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-50 text-neutral-300 ring-1 ring-neutral-100">
            <X className="h-3 w-3" />
          </div>
        );
      }
      return (
        <div className="relative h-11 w-11 overflow-hidden rounded-lg ring-1 ring-neutral-100">
          <Image
            src={imageSrc}
            alt="Item"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      );
    }

    if (col.kind === "badge") {
      const text = String(value ?? "");
      const badgeVariant = col.badgeVariantMap?.[text] ?? "outline";
      return <Badge variant={badgeVariant}>{text || "—"}</Badge>;
    }

    return (
      <span className="text-[13px] text-neutral-700">
        {String(value ?? "—")}
      </span>
    );
  }

  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (sortKey !== colKey)
      return <ArrowUpDown className="ml-1 inline h-3 w-3 text-white/30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3 w-3 text-brand-green" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3 text-brand-green" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-300" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 rounded-lg pl-10 text-[13px] border-neutral-200 bg-white placeholder:text-neutral-300 focus:border-brand-green/30 focus:ring-2 focus:ring-brand-green/10"
          />
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && deleteAction && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="rounded-lg text-[11px] uppercase tracking-wider"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete ({selected.size})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="rounded-lg text-[11px] uppercase tracking-wider border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <span className="hidden sm:inline text-[11px] text-neutral-400">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrapper overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-900 hover:bg-neutral-900 border-b border-neutral-800">
              {deleteAction && (
                <TableHead className="w-10 pl-4">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-white/30 accent-brand-green"
                  />
                </TableHead>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable !== false && col.kind !== "image";
                return (
                  <TableHead
                    key={col.key}
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-white ${
                      isSortable ? "cursor-pointer select-none hover:text-white/80" : ""
                    }`}
                    onClick={isSortable ? () => toggleSort(col.key) : undefined}
                  >
                    {col.label}
                    {isSortable && <SortIcon colKey={col.key} />}
                  </TableHead>
                );
              })}
              <TableHead className="w-24 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (deleteAction ? 2 : 1)}
                  className="py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-50">
                      <Search className="h-6 w-6 text-neutral-300" />
                    </div>
                    <p className="text-sm font-medium text-neutral-500">
                      {search ? "No matching results" : "No items yet"}
                    </p>
                    <p className="text-[12px] text-neutral-400">
                      {search
                        ? "Try adjusting your search query"
                        : "Create your first item to get started"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow
                  key={item.id}
                  className={`transition-colors border-b border-neutral-50/80 ${
                    selected.has(item.id)
                      ? "bg-brand-green/[0.03]"
                      : "hover:bg-neutral-50/60"
                  }`}
                >
                  {deleteAction && (
                    <TableCell className="pl-4">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                        className="h-4 w-4 rounded border-brand-charcoal/30 accent-brand-green"
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {renderValue(col, item)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-neutral-400 hover:text-brand-green hover:bg-brand-green/[0.05]"
                        asChild
                      >
                        <Link href={`${editPath}/${item.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      {deleteAction && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
          <p className="text-[11px] text-neutral-400">
            Showing{" "}
            <span className="font-semibold text-neutral-600">
              {(safeCurrentPage - 1) * pageSize + 1}
            </span>
            –
            <span className="font-semibold text-neutral-600">
              {Math.min(safeCurrentPage * pageSize, sorted.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-neutral-600">
              {sorted.length}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage(1)}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (safeCurrentPage <= 3) {
                page = i + 1;
              } else if (safeCurrentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = safeCurrentPage - 2 + i;
              }
              return (
                <Button
                  key={page}
                  variant={page === safeCurrentPage ? "primary" : "outline"}
                  size="icon"
                  className="h-8 w-8 text-xs"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
