"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useBookingChat } from "@/components/useBookingChat";

export interface StudentConversation {
  bookingId: string;
  status: string;
  createdAt: string;
  hostelId: string;
  hostelName: string;
  hostelCity: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string | null;
}

interface ManagerMessageCenterClientProps {
  conversations: StudentConversation[];
  managerName: string;
  managerHasAadhaar: boolean;
}

export default function ManagerMessageCenterClient({
  conversations = [],
  managerHasAadhaar,
}: ManagerMessageCenterClientProps) {
  const [selectedChatId, setSelectedChatId] = useState<string>(
    conversations[0]?.bookingId || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "CONFIRMED">("ALL");

  const activeConv = conversations.find((c) => c.bookingId === selectedChatId) || conversations[0];

  const { messages, send } = useBookingChat(activeConv?.bookingId);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cleanPhone = activeConv?.studentPhone ? activeConv.studentPhone.replace(/\D/g, "").slice(-10) : null;

  const quickReplies = [
    "Your room request is approved! You can move in anytime.",
    "Please visit between 10 AM and 6 PM for physical verification.",
    "Security deposit is 1 month rent, fully refundable on checkout.",
    "Gate curfew is 10:30 PM on weekdays and 11 PM on weekends.",
    "Wi-Fi details and bed allocation will be shared on move-in day.",
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.studentName.toLowerCase().includes(q);
      const matchHostel = c.hostelName.toLowerCase().includes(q);
      if (!matchName && !matchHostel) return false;
    }

    if (filterStatus === "PENDING" && c.status !== "PENDING") return false;
    if (filterStatus === "CONFIRMED" && c.status !== "CONFIRMED" && c.status !== "APPROVED")
      return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* ── TOP BANNER ── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-8 rounded-[2.5rem] border border-amber-400/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="pointer-events-none absolute -top-12 -right-12 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
              💬 Direct Student Chat Hub
            </span>
            {managerHasAadhaar ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span>🛡️</span>
                <span>Aadhaar Verified Host</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                ⚠️ Unverified Host
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Manager Message Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-normal leading-relaxed">
            Chat in real time with students who requested beds or sent inquiries. Contact numbers are confidential to your portal.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 self-start md:self-auto">
          <Link
            href="/dashboard/manager"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition backdrop-blur-md"
          >
            ← Operations Dashboard
          </Link>
          <Link
            href="/dashboard/manager/listings/new"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 transition shadow-sm"
          >
            + List Property
          </Link>
        </div>
      </div>

      {/* ── TWO-PANE CHAT SUITE ── */}
      {conversations.length === 0 ? (
        <div className="bg-white p-12 sm:p-16 rounded-[2rem] border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <span className="text-5xl block">💬</span>
          <h3 className="text-lg font-bold text-slate-900">No student inquiries yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-normal">
            When college students discover your listed hostel or PG and click &quot;Request Bed&quot; or inquiry, their chat thread will appear right here instantly.
          </p>
          <Link
            href="/dashboard/manager"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition"
          >
            View Your Properties →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[800px]">
          {/* ── LEFT PANE: CONVERSATION LIST ── */}
          <div className="md:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/60">
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Inbox ({filteredConversations.length})
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Live Sync</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student or hostel..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none focus:bg-white focus:border-cyan-600 transition"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">🔍</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(["ALL", "PENDING", "CONFIRMED"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition cursor-pointer ${
                      filterStatus === status
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {status === "ALL" ? "All" : status === "PENDING" ? "Pending" : "Confirmed"}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items */}
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
                    {/* Student Avatar Initial */}
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                      {conv.studentName[0]?.toUpperCase() || "S"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.studentName}
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

                      <p className="text-[11px] font-semibold text-cyan-800 truncate mt-0.5">
                        🏢 {conv.hostelName}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Applied {new Date(conv.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT PANE: ACTIVE CHAT ROOM ── */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-base shadow-xs">
                      {activeConv.studentName[0]?.toUpperCase() || "S"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {activeConv.studentName}
                        </h2>
                        <span className="text-[10px] font-semibold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full shrink-0">
                          Student Applicant
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        Inquiring for <strong className="text-slate-800 font-semibold">{activeConv.hostelName}</strong> • {activeConv.hostelCity}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Call & WhatsApp */}
                  <div className="flex items-center gap-2 shrink-0">
                    {cleanPhone && (
                      <>
                        <a
                          href={`tel:+91${cleanPhone}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold transition flex items-center gap-1.5"
                          title={`Call student +91 ${cleanPhone}`}
                        >
                          <span>📞</span>
                          <span className="hidden sm:inline">+91 {cleanPhone}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                            `Hi ${activeConv.studentName}, I am contacting you from HostelConnect regarding your application for ${activeConv.hostelName}.`
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

                {/* Chat Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/30">
                  <div className="text-center py-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      Private Channel
                    </span>
                  </div>

                  {messages.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-8">
                      No messages yet. Send the first reply to start the conversation.
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
                            {isMe ? "You (Manager)" : msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-tr-xs"
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

                {/* Quick Reply Chips */}
                <div className="p-3 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1 shrink-0">
                    Quick Replies:
                  </span>
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(reply)}
                      className="px-2.5 py-1 rounded-lg bg-amber-50/80 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold whitespace-nowrap transition cursor-pointer"
                    >
                      {reply}
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
                      placeholder="Type your response to the student..."
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-cyan-600 bg-slate-50 focus:bg-white transition"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-xs"
                    >
                      Send →
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                Select a conversation on the left to start chatting.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}