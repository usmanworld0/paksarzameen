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
      const response = await fetch(
        `/api/healthcare/blood-bank/chat?donorUserId=${encodeURIComponent(donorUserId)}`,
        { cache: "no-store" },
      );

      const payload = (await response.json()) as {
        data?: DonorChatMessage[];
        error?: string;
      };
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

      const payload = (await response.json()) as {
        data?: DonorChatMessage;
        error?: string;
      };
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
    <div className="site-stack mt-4">
      {error ? <p className="site-status--error">{error}</p> : null}
      <div className="max-h-40 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <article key={message.messageId} className="site-panel site-panel--soft">
            <div className="site-panel__body !p-4">
              <p className="site-card__eyebrow">
                {message.senderName ?? "User"} / {new Date(message.createdAt).toLocaleString()}
              </p>
              <p className="site-copy site-copy--sm mt-3 text-[#111111]">{message.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="site-form-actions">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Chat with donor"
          className="site-input flex-1"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => void sendMessage()}
          className="site-button disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
