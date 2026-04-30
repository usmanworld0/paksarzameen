"use client";

import { useEffect, useState } from "react";

type AppointmentMessage = {
  messageId: string;
  appointmentId: string;
  senderId: string;
  senderName: string | null;
  body: string;
  attachmentUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export function AppointmentChatBox({ appointmentId }: { appointmentId: string }) {
  const [messages, setMessages] = useState<AppointmentMessage[]>([]);
  const [value, setValue] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMessages(signal?: AbortSignal) {
    const response = await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
      cache: "no-store",
      signal,
    });
    const payload = (await response.json()) as { data?: AppointmentMessage[]; error?: string };
    if (!response.ok) {
      setError(payload.error ?? "Unable to load chat messages.");
      return;
    }

    setMessages(payload.data ?? []);
    await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
      method: "PATCH",
      cache: "no-store",
      signal,
    });
  }

  useEffect(() => {
    const controller = new AbortController();

    void loadMessages(controller.signal);

    const intervalId = window.setInterval(() => {
      void loadMessages(controller.signal);
    }, 8000);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [appointmentId]);

  async function sendMessage() {
    if (!value.trim()) return;
    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body: value, attachmentUrl: attachmentUrl || undefined }),
      });

      const payload = (await response.json()) as { data?: AppointmentMessage; error?: string };
      if (!response.ok) {
        setError(payload.error ?? "Unable to send message.");
        return;
      }

      if (response.ok && payload.data) {
        setMessages((prev) => [...prev, payload.data as AppointmentMessage]);
        setValue("");
        setAttachmentUrl("");
        await fetch(`/api/healthcare/appointments/${appointmentId}/messages`, {
          method: "PATCH",
          cache: "no-store",
        });
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border border-[#E5E5E5] bg-white p-4 rounded-none">
      <div className="max-h-64 space-y-4 overflow-y-auto pr-2 scrollbar-thin">
        {messages.map((message) => (
          <div key={message.messageId} className="text-sm">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#707072] mb-1">
              {message.senderName ?? "User"} / {new Date(message.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}
             </p>
             <p className="bg-[#F5F5F5] p-3 text-[#111111] inline-block max-w-[85%]">{message.body}</p>
             {message.attachmentUrl ? (
              <a
                href={message.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-xs font-bold uppercase tracking-wide text-[#1151FF] hover:underline"
              >
                OPEN ATTACHMENT
              </a>
             ) : null}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-xs font-medium uppercase tracking-widest text-[#CACACB] text-center my-4">No messages yet</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E5E5E5] space-y-3">
        <div className="flex gap-3">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void sendMessage(); }}
            placeholder="Type a message..."
            className="flex-1 border-[#CACACB] bg-[#F5F5F5] px-4 py-3 border focus:border-[#111111] outline-none text-sm transition rounded-none"
          />
          <button
            type="button"
            disabled={sending}
            onClick={() => void sendMessage()}
            className="bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wide text-white disabled:opacity-50 transition hover:bg-[#707072] rounded-none"
          >
            {sending ? "SENDING" : "SEND"}
          </button>
        </div>
        <input
          value={attachmentUrl}
          onChange={(event) => setAttachmentUrl(event.target.value)}
          placeholder="Optional attachment URL"
          className="w-full border-b border-[#CACACB] bg-transparent py-2 text-xs focus:border-[#111111] outline-none transition rounded-none"
        />
        {error ? <p className="text-xs font-medium text-[#D30005]">{error}</p> : null}
      </div>
    </div>
  );
}