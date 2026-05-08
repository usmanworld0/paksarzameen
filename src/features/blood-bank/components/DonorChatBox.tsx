"use client";

import { useEffect, useState } from "react";

type DonorChatMessage = {
  messageId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  createdAt: string;
};

export function DonorChatBox({ donorUserId }: { donorUserId: string }) {
  const [messages, setMessages] = useState<DonorChatMessage[]>([]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      const response = await fetch(`/api/healthcare/blood-bank/chat?donorUserId=${encodeURIComponent(donorUserId)}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as { data?: DonorChatMessage[]; error?: string };
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

      const payload = (await response.json()) as { data?: DonorChatMessage; error?: string };
      if (!response.ok || !payload.data) {
        setError(payload.error ?? "Unable to send message.");
        return;
      }

      setError(null);
      setMessages((prev) => [...prev, payload.data as DonorChatMessage]);
      setValue("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-[#E5E5E5] bg-white p-3">
      {error ? (
        <p className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
      <div className="max-h-36 space-y-2 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.messageId} className="text-xs">
            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#707072]">
              {message.senderName ?? "User"} &middot; {new Date(message.createdAt).toLocaleString()}
            </p>
            <p className="rounded-2xl rounded-bl-sm border border-[#E5E5E5] bg-[#f3f3ee] px-4 py-2.5 text-sm text-[#111111]">
              {message.body}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Chat with donor"
          className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-2.5 text-sm text-[#111111] outline-none transition placeholder:text-[#bbb] focus:border-[#0f7a47] focus:ring-2 focus:ring-[#0f7a47]/10"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => void sendMessage()}
          className="rounded-xl bg-[#0f7a47] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#1a9d5f] disabled:opacity-50"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
