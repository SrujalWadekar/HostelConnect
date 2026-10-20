"use client";

import { useState, useEffect, useRef } from "react";
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
  // Callers pass `booking_<id>`; the database only needs the id
  const bookingId = chatId.replace(/^booking_/, "");
  const { messages, loading, sending, error, send } = useBookingChat(bookingId);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cleanPhone = recipientPhone ? recipientPhone.replace(/\D/g, "").slice(-10) : null;

  const quickSuggestions =
    senderRole === "STUDENT"
      ? [
          "Can I schedule a visit to see the room?",
          "Are meals/food included in the monthly rent?",
          "What is the security deposit amount?",
          "What are the gate timings and curfew?",
        ]
      : [
          "Your booking request is approved! You can move in anytime.",
          "Please visit the hostel between 10 AM and 6 PM for verification.",
          "Security deposit is 1 month rent, fully refundable on checkout.",
          "Gate closes at 10:30 PM on weekdays and 11 PM on weekends.",
        ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(textToSend?: string) {
    const content = (textToSend || inputText).trim();
    if (!content) return;
    setInputText("");
    await send(content);
  }

  const isStudent = senderRole === "STUDENT";
  const accentTheme = isStudent
    ? {
        bubble: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white",
        sendBtn: "bg-cyan-600 hover:bg-cyan-500",
      }
    : {
        bubble: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
        sendBtn: "bg-amber-600 hover:bg-amber-500",
      };

  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
        `Hi ${recipientName}, I am contacting you from HostelConnect regarding ${propertyTitle || "the accommodation"}.`
      )}`
    : null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col bg-white rounded-[2rem] w-full max-w-lg shadow-2xl border border-slate-200 h-[88vh] max-h-[680px] overflow-hidden animate-in zoom-in-95"
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#020617] text-white font-bold text-base shadow-sm">
                {recipientName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{title}</h3>
              <p className="text-xs text-slate-500 truncate">{subtitle || recipientName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {cleanPhone && (
              <a
                href={`tel:+91${cleanPhone}`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                title={`Call +91 ${cleanPhone}`}
              >
                <span>📞</span>
                <span className="hidden sm:inline">Call</span>
              </a>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-semibold transition"
                title="Chat on WhatsApp"
              >
                <span>💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTACT BAR */}
        {cleanPhone ? (
          <div className="bg-cyan-50/60 border-b border-cyan-100 px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">Verified Contact:</span>
              <span className="font-mono text-cyan-800 font-bold">
                +91 {cleanPhone.slice(0, 5)} {cleanPhone.slice(5)}
              </span>
            </span>
            <span className="text-[10px] uppercase font-bold text-cyan-700 tracking-wider">Direct Access</span>
          </div>
        ) : (
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-1.5 text-[11px] text-slate-500">
            <span>Live in-app chat • Both of you see the same conversation</span>
          </div>
        )}

        {/* MESSAGES */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#f8fafc]">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {loading && messages.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-10">Loading messages…</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">👋</p>
              <p className="text-sm font-bold text-slate-700">No messages yet</p>
              <p className="text-xs text-slate-400 mt-1">Say hello to start the conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === "ME";
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                      isMe
                        ? `${accentTheme.bubble} rounded-tr-xs`
                        : "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">{msg.timestamp}</span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(suggestion)}
              className="shrink-0 px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium transition cursor-pointer"
            >
              + {suggestion}
            </button>
          ))}
        </div>

        {/* COMPOSER */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={1000}
            placeholder={`Message ${recipientName}...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none focus:bg-white focus:border-cyan-500 transition"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className={`px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${accentTheme.sendBtn}`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}