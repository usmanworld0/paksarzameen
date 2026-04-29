import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "HealthCare — PakSarZameen",
  description: "Healthcare services: AI assistant, doctor appointments, blood bank and patient-doctor chat.",
  openGraph: {
    title: "HealthCare — PakSarZameen",
    description: "Healthcare services: AI assistant, doctor appointments, blood bank and patient-doctor chat.",
    url: "https://healthcare.paksarzameenwfo.com",
  },
};

// Small client-side fetch proxy will be installed in useEffect inside layout to prepend API base for relative /api calls.

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white/50">
          <div className="mx-auto max-w-screen-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-50 p-2 text-2xl">🏥</div>
                <div>
                  <h1 className="text-lg font-semibold">PakSarZameen HealthCare</h1>
                  <p className="text-xs text-slate-500">AI-assisted medical support & appointments</p>
                </div>
              </div>
              <nav>
                <a href="/healthcare" className="text-sm font-medium text-blue-600">HealthCare</a>
              </nav>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-20 border-t bg-white/50">
          <div className="mx-auto max-w-screen-2xl px-6 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} PakSarZameen — HealthCare
          </div>
        </footer>
      </body>
    </html>
  );
}
