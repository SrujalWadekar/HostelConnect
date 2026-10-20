"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useBookingChat } from "./useBookingChat";

export type { ChatMessage } from "./useBookingChat";

export interface ChatModalProps {
  chatId: string;
  title: string;
  subtitle?: string;
  recipientName: string;
  recipientPhone?: string | null;
  senderRole: "STUDENT" | "MANAGER";
  propertyTitle?: string;
  onClose: () => void;
}

type IconName = "close" | "send" | "phone" | "chat" | "building";

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    close: <path d="m6 6 12 12M18 6 6 18" />,
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" />
    ),
    chat: (
      <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
    ),
    building: (
      <>
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M2 21h20M9 21v-4h6v4" />
        <path d="M8 7h1m6 0h1M8 11h1m6 0h1" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export default function ChatModal({
  chatId,
  title,
  subtitle,
  recipientName,
  recipientPhone,
  senderRole,
  propertyTitle,
  onClose,
}: ChatModalProps) {
  const bookingId = chatId.replace(/^booking_/, "");

  const {
    messages,
    loading,
    sending,
    error,
    needsBooking,
    send,
  } = useBookingChat(bookingId);

  const [inputText, setInputText] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nearBottomRef = useRef(true);
  const sendLockRef = useRef(false);

  const headingId = useId();
  const inputId = useId();

  const recipientRole =
    senderRole === "STUDENT" ? "Hostel manager" : "Student";

  const cleanPhone = recipientPhone?.replace(/\D/g, "").slice(-10);
  const hasPhone = cleanPhone?.length === 10;

  const whatsappUrl = hasPhone
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
        `Hi ${recipientName}, I am contacting you from HostelConnect regarding ${
          propertyTitle || "the accommodation"
        }.`
      )}`
    : null;

  const quickReplies =
    senderRole === "STUDENT"
      ? [
          "Can I schedule a room visit?",
          "Are meals included?",
          "What is the security deposit?",
          "What are the gate timings?",
        ]
      : [
          "When would you like to visit?",
          "What is your preferred move-in date?",
          "How can I help with your booking?",
        ];

  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id;
  const lastMessageIsMine = lastMessage?.sender === "ME";

  // Native modal dialog handles focus containment and restoration.
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      dialog?.close();
    };
  }, []);

  useEffect(() => {
    setInputText("");
    nearBottomRef.current = true;
  }, [chatId]);

  // Do not pull someone to the bottom while they read older messages.
  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;

    if (nearBottomRef.current || lastMessageIsMine) {
      transcript.scrollTop = transcript.scrollHeight;
      nearBottomRef.current = true;
    }
  }, [lastMessageId, lastMessageIsMine]);

  // Grow the composer up to a comfortable maximum height.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [inputText]);

  async function handleSend() {
    const content = inputText.trim();

    if (
      !content ||
      sending ||
      loading ||
      needsBooking ||
      sendLockRef.current
    ) {
      return;
    }

    sendLockRef.current = true;

    try {
      const sent = await send(content);

      if (sent) {
        setInputText("");
        textareaRef.current?.focus();
      }
    } finally {
      sendLockRef.current = false;
    }
  }

  function selectQuickReply(text: string) {
    setInputText(text);
    textareaRef.current?.focus();
  }

  const composerDisabled = needsBooking || loading || sending;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="
        fixed inset-0 m-auto h-[100dvh] max-h-[100dvh]
        w-full max-w-none overflow-hidden border-0 bg-transparent p-0
        text-slate-900 outline-none
        backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm
        sm:h-[min(90dvh,800px)] sm:w-[calc(100%-2rem)]
        sm:max-w-2xl sm:rounded-3xl
      "
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <header className="shrink-0 border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-sm font-bold text-indigo-700">
                {initials(recipientName)}
              </div>

              <div className="min-w-0">
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                  HostelConnect · Messages
                </p>

                <h2
                  id={headingId}
                  title={title}
                  className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg"
                >
                  {title || recipientName}
                </h2>

                <p className="truncate text-xs text-slate-500">
                  {subtitle || `${recipientName} · ${recipientRole}`}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {hasPhone && (
                <a
                  href={`tel:+91${cleanPhone}`}
                  aria-label={`Call ${recipientName}`}
                  title={`Call ${recipientName}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                >
                  <Icon name="phone" className="h-4 w-4" />
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open WhatsApp with ${recipientName}`}
                  title="Open WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                >
                  <Icon name="chat" className="h-4 w-4" />
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close conversation"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <Icon name="close" />
              </button>
            </div>
          </div>
        </header>

        {/* Conversation context */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/70 bg-slate-50 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
            <Icon
              name="building"
              className="h-4 w-4 shrink-0 text-indigo-500"
            />
            <span className="truncate font-medium">
              {propertyTitle || "Accommodation enquiry"}
            </span>
          </div>

          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500">
            Booking chat
          </span>
        </div>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          role="log"
          aria-label={`Conversation with ${recipientName}`}
          aria-live="polite"
          aria-relevant="additions"
          aria-busy={loading}
          onScroll={() => {
            const node = transcriptRef.current;
            if (!node) return;

            nearBottomRef.current =
              node.scrollHeight - node.scrollTop - node.clientHeight < 100;
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-100/80 px-4 py-6 sm:px-6"
        >
          {needsBooking ? (
            <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-indigo-100 p-4 text-indigo-600">
                <Icon name="building" className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                Request a bed to start chatting
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Once you send a booking request, you can discuss the room,
                rent, and move-in details here.
              </p>
            </div>
          ) : loading && messages.length === 0 ? (
            <div
              role="status"
              className="flex min-h-full items-center justify-center gap-3 text-sm text-slate-500"
            >
              <span
                aria-hidden="true"
                className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 motion-reduce:animate-none"
              />
              Loading your conversation…
            </div>
          ) : messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-3xl bg-white p-5 text-indigo-600 shadow-sm ring-1 ring-slate-200">
                <Icon name="chat" className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Start with a hello
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Message {recipientName} about your accommodation.
                Your conversation will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="mb-6 flex justify-center">
                <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-500">
                  You’re chatting with {recipientName}
                </span>
              </div>

              {messages.map((message) => {
                const isMe = message.sender === "ME";
                const name = isMe
                  ? "You"
                  : message.senderName || recipientName;

                return (
                  <div
                    key={message.id}
                    className={`flex w-full items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && (
                      <div
                        aria-hidden="true"
                        title={name}
                        className="mb-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-slate-600"
                      >
                        {initials(name)}
                      </div>
                    )}

                    <div
                      className={`flex min-w-0 max-w-[82%] flex-col sm:max-w-[75%] ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <span
                        className={`mb-1.5 px-1 text-[11px] font-semibold ${
                          isMe ? "text-indigo-600" : "text-slate-600"
                        }`}
                      >
                        {name}
                      </span>

                      <div
                        className={`max-w-full rounded-2xl px-4 py-3 shadow-sm ${
                          isMe
                            ? "rounded-br-md bg-indigo-600 text-white"
                            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 [overflow-wrap:anywhere]">
                          {message.text}
                        </p>
                      </div>

                      <span className="mt-1.5 px-1 text-[10px] text-slate-500">
                        {message.timestamp}
                        {isMe && message.id.startsWith("tmp-")
                          ? " · Sending…"
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error feedback stays visible above the composer */}
        {error && (
          <div
            role="alert"
            className="shrink-0 border-t border-rose-100 bg-rose-50 px-4 py-2.5 text-xs leading-5 text-rose-700 sm:px-6"
          >
            {error}
          </div>
        )}

        {/* Quick replies are drafts, not instant sends */}
        {!needsBooking && (
          <div className="shrink-0 border-t border-slate-200/80 bg-white px-4 pb-3 pt-3 sm:px-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick replies
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  disabled={composerDisabled}
                  onClick={() => selectQuickReply(reply)}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSend();
          }}
          className="shrink-0 bg-white px-4 pt-1 sm:px-6"
          style={{
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <label htmlFor={inputId} className="sr-only">
            Message {recipientName}
          </label>

          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50">
            <textarea
              ref={textareaRef}
              id={inputId}
              rows={1}
              value={inputText}
              maxLength={1000}
              disabled={composerDisabled}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder={
                needsBooking
                  ? "A booking request is needed to chat"
                  : `Message ${recipientName}…`
              }
              className="max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-2 py-3 text-base leading-5 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed sm:text-sm"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || composerDisabled}
              aria-label={sending ? "Sending message" : "Send message"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
            >
              {sending ? (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
                />
              ) : (
                <Icon name="send" className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] text-slate-400">
            <span>
              <span className="hidden sm:inline">
                Enter to send · Shift + Enter for a new line
              </span>
              <span className="sm:hidden">Tap the arrow to send</span>
            </span>
            <span>{inputText.length}/1000</span>
          </div>
        </form>
      </div>
    </dialog>
  );
}