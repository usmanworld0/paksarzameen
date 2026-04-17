"use client";

import { useEffect, useState } from "react";

type AppointmentMessage = {
  messageId: string;
  appointmentId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  createdAt: string;
};

export function AppointmentChatBox({ appointmentId }: { appointmentId: string }) {
  const [messages, setMessages] = useState<AppointmentMessage[]>([]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadMessages() {
      const response = await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as { data?: AppointmentMessage[] };
      if (active && response.ok) {
        setMessages(payload.data ?? []);
      }
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, [appointmentId]);

  async function sendMessage() {
    if (!value.trim()) return;
    setSending(true);
    try {
      const response = await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: value }),
      });

      const payload = (await response.json()) as { data?: AppointmentMessage };
      if (response.ok && payload.data) {
        setMessages((prev) => [...prev, payload.data as AppointmentMessage]);
        setValue("");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.messageId} className="text-sm">
            <p className="text-xs text-slate-500">
              {message.senderName ?? "User"} • {new Date(message.createdAt).toLocaleString()}
            </p>
            <p className="rounded-lg bg-slate-50 p-2 text-slate-800">{message.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Write a message"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={sending}
          onClick={() => void sendMessage()}
          className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
