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
    <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
      <div className="border-b border-[#E5E5E5] px-4 py-3">
        <p className="text-sm font-black tracking-tight text-[#111111]">Messages</p>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-3 p-4">
        {messages.length === 0 && (
          <p className="text-xs font-medium text-[#707072] text-center py-4">No messages yet. Start the conversation.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#707072]">
              {m.senderName ?? m.senderId} &middot; {new Date(m.createdAt).toLocaleString()}
            </p>
            <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-2.5 text-sm text-[#111111]">
              {m.body}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E5E5E5] p-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
          placeholder="Write a message to the team"
        />
        <button
          className="rounded-xl bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#333] disabled:opacity-50"
          disabled={sending}
          onClick={() => void send()}
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
