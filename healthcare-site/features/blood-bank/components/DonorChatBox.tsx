"use client";

import { useEffect, useState } from "react";

export function DonorChatBox({ donorUserId }: { donorUserId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      const response = await fetch(`/api/healthcare/blood-bank/chat?donorUserId=${encodeURIComponent(donorUserId)}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as { data?: any[]; error?: string };
      if (!active) return;

      if (!response.ok) {
        setError(payload.error ?? "Unable to load donor chat.");
        return;
      }

      setError(null);
      setMessages(payload.data ?? []);
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, [donorUserId]);

  async function sendMessage() {
    if (!value.trim()) return;
    setSending(true);

    try {
      const response = await fetch("/api/healthcare/blood-bank/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ donorUserId, body: value }),
      });

      const payload = (await response.json()) as { data?: any; error?: string };
      if (!response.ok || !payload.data) {
        setError(payload.error ?? "Unable to send message.");
        return;
      }

      setError(null);
      setMessages((prev) => [...prev, payload.data as any]);
      setValue("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
      {error ? <p className="mb-2 text-xs text-red-700">{error}</p> : null}
      <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.messageId} className="text-xs">
            <p className="text-slate-500">{message.senderName ?? "User"} • {new Date(message.createdAt).toLocaleString()}</p>
            <p className="rounded-md bg-slate-50 p-2 text-slate-800">{message.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Chat with donor" className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-xs" />
        <button type="button" disabled={sending} onClick={() => void sendMessage()} className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{sending ? "..." : "Send"}</button>
      </div>
    </div>
  );
}
