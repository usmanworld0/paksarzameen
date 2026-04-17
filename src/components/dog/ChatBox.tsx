"use client";

import { useEffect, useState } from "react";

export type Message = {
  id: string;
  dogId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  createdAt: string;
};

export default function ChatBox({ dogId, initialMessages = [] }: { dogId: string; initialMessages?: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/dog-messages?dogId=${encodeURIComponent(dogId)}`);
        if (!res.ok) return;
        const payload = await res.json();
        setMessages(payload.data ?? []);
      } catch {
        // ignore
      }
    }

    void load();
  }, [dogId]);

  async function send() {
    if (!value.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/dog-messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dogId, body: value }),
      });

      const payload = await res.json();
      if (res.ok && payload.data) {
        setMessages((m) => [...m, payload.data]);
        setValue("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="max-h-80 overflow-y-auto space-y-2 pb-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm">
            <div className="text-xs text-slate-500">{m.senderName ?? m.senderId} • {new Date(m.createdAt).toLocaleString()}</div>
            <div className="mt-1 rounded-md bg-slate-50 p-2 text-slate-800">{m.body}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write a message to the tenant"
        />
        <button
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          disabled={sending}
          onClick={() => void send()}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
