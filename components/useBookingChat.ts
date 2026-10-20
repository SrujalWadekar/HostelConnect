"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "ME" | "OTHER";
  senderName: string;
  text: string;
  timestamp: string;
}

interface ApiMessage {
  id: string;
  text: string;
  createdAt: string;
  mine: boolean;
  senderName: string;
}

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export function useBookingChat(bookingId: string | null | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeId = useRef<string | null>(null);

  const load = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as { messages: ApiMessage[] };

      // Ignore late responses from a conversation we've already switched away from
      if (activeId.current !== id) return;

      setMessages(
        data.messages.map((m) => ({
          id: m.id,
          sender: m.mine ? "ME" : "OTHER",
          senderName: m.senderName,
          text: m.text,
          timestamp: timeFormat.format(new Date(m.createdAt)),
        }))
      );
      setError(null);
    } catch {
      if (activeId.current === id) setError("Couldn't load messages.");
    } finally {
      if (activeId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => {
    activeId.current = bookingId ?? null;
    setMessages([]);
    setLoading(Boolean(bookingId));
    if (!bookingId) return;

    load(bookingId);
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load(bookingId);
    }, 4000);

    return () => clearInterval(timer);
  }, [bookingId, load]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!bookingId || !clean) return false;

      const tempId = `tmp-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          sender: "ME",
          senderName: "You",
          text: clean,
          timestamp: timeFormat.format(new Date()),
        },
      ]);

      setSending(true);
      try {
        const res = await fetch(`/api/messages/${bookingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean }),
        });
        if (!res.ok) throw new Error("Failed to send");
        await load(bookingId);
        return true;
      } catch {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Message failed to send. Please try again.");
        return false;
      } finally {
        setSending(false);
      }
    },
    [bookingId, load]
  );

  return { messages, loading, sending, error, send };
}