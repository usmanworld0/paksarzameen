import Link from "next/link";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-neutral-400 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Categories
        </Link>
        <p className="admin-page-subtitle">Organization</p>
        <h1 className="admin-page-title mt-1">New Category</h1>
        <p className="mt-1.5 text-sm text-neutral-400">Create a new product collection</p>
      </div>
      <div className="h-px bg-neutral-100" />
      <div className="admin-form-card">
        <CategoryForm />
      </div>
    </div>
  );
}
