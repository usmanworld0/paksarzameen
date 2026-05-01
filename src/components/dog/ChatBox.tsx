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

export default function ChatBox({
  dogId,
  initialMessages = [],
}: {
  dogId: string;
  initialMessages?: Message[];
}) {
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
      const res = await fetch("/api/dog-messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dogId, body: value }),
      });

      const payload = await res.json();
      if (res.ok && payload.data) {
        setMessages((current) => [...current, payload.data]);
        setValue("");
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="site-stack">
      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="site-empty">No messages yet. Start the conversation below.</div>
        ) : (
          messages.map((message) => (
            <article key={message.id} className="site-panel site-panel--soft">
              <div className="site-panel__body !p-4">
                <p className="site-card__eyebrow">
                  {message.senderName ?? message.senderId} / {new Date(message.createdAt).toLocaleString()}
                </p>
                <p className="site-copy site-copy--sm mt-3 text-[#111111]">{message.body}</p>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="site-form-actions">
        <input
          className="site-input flex-1"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write a message"
        />
        <button
          className="site-button disabled:opacity-70"
          disabled={sending}
          onClick={() => void send()}
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
