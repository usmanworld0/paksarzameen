import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-6">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-neutral-900 mb-2">Page Not Found</p>
        <p className="text-neutral-600 mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
