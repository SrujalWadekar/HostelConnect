"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useBookingChat } from "@/components/useBookingChat";

export interface PropertyConversation {
  bookingId: string;
  hostelId: string;
  hostelName: string;
  hostelCity: string;
  hostelAddress: string;
  monthlyPrice: number;
  type: string;
  gender: string;
  status: string;
  managerName: string;
  ownerPhone?: string | null;
  aadhaarNumber?: string | null;
  createdAt: string;
}

interface StudentMessageCenterClientProps {
  conversations: PropertyConversation[];
  studentName: string;
}

export default function StudentMessageCenterClient({
  conversations = [],
}: StudentMessageCenterClientProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    conversations[0]?.bookingId || ""
  );
  const [searchQuery, setSearchQuery] = useState("");

  const activeConv = conversations.find((c) => c.bookingId === selectedChatId) || conversations[0];

  const { messages, send } = useBookingChat(activeConv?.bookingId);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cleanPhone = activeConv?.ownerPhone ? activeConv.ownerPhone.replace(/\D/g, "").slice(-10) : null;
  const isAadhaarVerified = Boolean(
    activeConv?.aadhaarNumber && activeConv.aadhaarNumber.trim().length >= 12
  );

  const quickQuestions = [
    "Can I schedule a visit to see the room?",
    "Are meals / food included in the monthly rent?",
    "What is the security deposit amount?",
    "What are the gate timings and curfew?",
    "Is high-speed Wi-Fi provided in each room?",
    "Are laundry and washing machine facilities available?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv) return;
    setInputText("");
    await send(text);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.hostelName.toLowerCase().includes(q) || c.hostelCity.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* ── TOP BANNER ── */}
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white p-6 sm:p-8 rounded-[2.5rem] border border-cyan-400/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-400/15 border border-cyan-400/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
              🎓 Student Message Center
            </span>
            <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Direct Landlord Inquiries
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Your Host Conversations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
            Discuss room visits, deposit amounts, gate curfews, and food facilities directly with verified property managers.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <Link
            href="/dashboard/student"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition backdrop-blur-md"
          >
            ← Explore Stays
          </Link>
          <Link
            href="/dashboard/student/profile"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition shadow-sm"
          >
            My Profile
          </Link>
        </div>
      </div>

      {/* ── TWO-PANE CHAT SUITE ── */}
      {conversations.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-[2rem] border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <span className="text-5xl block">🏠</span>
          <h3 className="text-lg font-bold text-slate-900">No active host chats yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            When you request a bed or click &quot;Chat&quot; on any hostel or PG card, your direct conversation with the landlord will be initiated here.
          </p>
          <Link
            href="/dashboard/student"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition"
          >
            Browse Accommodations →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[800px]">
          {/* ── LEFT PANE: HOSTEL CONVERSATION LIST ── */}
          <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/60">
            <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Your Requests ({filteredConversations.length})
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Live Connect</span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hostel or city..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none focus:bg-white focus:border-cyan-600 transition"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredConversations.map((conv) => {
                const isSelected = conv.bookingId === selectedChatId;
                const isApproved = conv.status === "CONFIRMED" || conv.status === "APPROVED";

                return (
                  <button
                    key={conv.bookingId}
                    type="button"
                    onClick={() => setSelectedChatId(conv.bookingId)}
                    className={`w-full text-left p-3.5 rounded-2xl transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-cyan-50/80 border border-cyan-300 shadow-xs"
                        : "hover:bg-slate-100/70 border border-transparent"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                      🏢
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.hostelName}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {conv.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                        📍 {conv.hostelCity} • ₹{conv.monthlyPrice.toLocaleString()}/mo
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Requested {new Date(conv.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT PANE: ACTIVE HOST CHAT ── */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center shrink-0 text-base shadow-xs">
                      🏢
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {activeConv.hostelName}
                        </h2>
                        {isAadhaarVerified ? (
                          <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                            <span>🛡️</span>
                            <span>Aadhaar Verified</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md shrink-0">
                            ⚠️ Unverified Host
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        Manager: <strong className="text-slate-800 font-semibold">{activeConv.managerName}</strong> • 📍 {activeConv.hostelAddress}, {activeConv.hostelCity}
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    {cleanPhone && (
                      <>
                        <a
                          href={`tel:+91${cleanPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                          title={`Call manager +91 ${cleanPhone}`}
                        >
                          <span>📞</span>
                          <span className="hidden sm:inline">+91 {cleanPhone}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                            `Hi! I have requested a bed for "${activeConv.hostelName}" on HostelConnect and would like to ask a few questions.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>💬</span>
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/30">
                  <div className="text-center py-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      Direct Landlord Channel
                    </span>
                  </div>

                  {messages.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-8">
                      No messages yet. Send a question to the manager to start the conversation.
                    </p>
                  )}

                  {messages.map((msg) => {
                    const isMe = msg.sender === "ME";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-baseline gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-500">
                            {isMe ? "You" : msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs"
                              : "bg-white text-slate-900 border border-slate-200 rounded-tl-xs"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions Chips */}
                <div className="p-3 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1 shrink-0">
                    Ask Host:
                  </span>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-50/80 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 text-xs font-semibold whitespace-nowrap transition cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Send Input Bar */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      maxLength={1000}
                      placeholder="Type a message or question to the manager..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-cyan-600 bg-slate-50 focus:bg-white transition"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                    >
                      Send →
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select a property request on the left to start chatting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}