"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Printer, QrCode, ExternalLink } from "lucide-react";

type DogQRCodeProps = {
  dogId: string;
  dogName: string;
  rescueName?: string;
  breed?: string;
};

export function DogQRCode({ dogId, dogName, rescueName, breed }: DogQRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const dogUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/dog/${dogId}`
      : `/dog/${dogId}`;

  useEffect(() => {
    if (!show) return;
    QRCode.toDataURL(
      typeof window !== "undefined" ? `${window.location.origin}/dog/${dogId}` : `/dog/${dogId}`,
      {
        width: 300,
        margin: 2,
        color: { dark: "#064e3b", light: "#ffffff" },
        errorCorrectionLevel: "H",
      }
    )
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(null));
  }, [show, dogId]);

  function handlePrint() {
    if (!qrDataUrl) return;
    const printUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/dog/${dogId}`
        : `/dog/${dogId}`;

    const win = window.open("", "_blank", "width=480,height=600");
    if (!win) return;

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>QR Code – ${dogName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      border: 2px solid #d1fae5;
      border-radius: 20px;
      padding: 32px 28px;
      text-align: center;
      max-width: 340px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(6,78,59,0.08);
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 100px;
      margin-bottom: 16px;
    }
    .dog-name {
      font-size: 26px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .rescue-name {
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .breed {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 20px;
    }
    .qr-wrap {
      display: inline-block;
      padding: 12px;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;
    }
    .qr-wrap img { display: block; width: 200px; height: 200px; }
    .url {
      font-size: 10px;
      color: #94a3b8;
      word-break: break-all;
      margin-bottom: 20px;
    }
    .footer {
      font-size: 11px;
      color: #10b981;
      font-weight: 600;
    }
    @media print {
      body { padding: 0; background: white; }
      .card { border: none; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Scan to Adopt</div>
    <div class="dog-name">${dogName}</div>
    ${rescueName ? `<div class="rescue-name">Rescue: ${rescueName}</div>` : ""}
    ${breed ? `<div class="breed">${breed}</div>` : ""}
    <div class="qr-wrap">
      <img src="${qrDataUrl}" alt="QR Code for ${dogName}" />
    </div>
    <div class="url">${printUrl}</div>
    <div class="footer">paksarzameen.com · Dog Adoption</div>
  </div>
  <script>window.onload = function(){ window.print(); }</script>
</body>
</html>`);
    win.document.close();
  }

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
      >
        <QrCode className="h-3.5 w-3.5" />
        QR Code
      </button>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">QR Code</p>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600"
        >
          Hide
        </button>
      </div>

      {!qrDataUrl ? (
        <div className="flex h-24 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl border border-emerald-200 bg-white p-2 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${dogName}`} className="h-28 w-28" />
          </div>
          <p className="max-w-full truncate text-center text-[10px] text-slate-400">{dogUrl}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <a
              href={`/dog/${dogId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Page
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
