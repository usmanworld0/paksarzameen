import "./globals.css";
import type { PropsWithChildren } from "react";

export const metadata = {
  title: "Dog Adoption — PakSarZameen",
  description: "Adopt a stray dog — browse profiles and submit adoption requests.",
  openGraph: {
    title: "Dog Adoption — PakSarZameen",
    description: "Adopt a stray dog — browse profiles and submit adoption requests.",
    url: "https://dogs.paksarzameenwfo.com",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white/50">
          <div className="mx-auto max-w-screen-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-2 text-2xl">🐾</div>
                <div>
                  <h1 className="text-lg font-semibold">PakSarZameen Dogs</h1>
                  <p className="text-xs text-slate-500">Adopt a stray, save a soul</p>
                </div>
              </div>
              <nav>
                <a href="/dog-adoption" className="text-sm font-medium text-emerald-700">Adopt a Dog</a>
              </nav>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t bg-white/50">
          <div className="mx-auto max-w-screen-2xl px-6 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} PakSarZameen — Dog Adoption
          </div>
        </footer>
      </body>
    </html>
  );
}
