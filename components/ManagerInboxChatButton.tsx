"use client";

import { useState } from "react";
import ChatModal from "./ChatModal";

interface ManagerInboxChatButtonProps {
  bookingId: string;
  studentName: string;
  studentPhone?: string | null;
  hostelName: string;
}

export default function ManagerInboxChatButton({
  bookingId,
  studentName,
  studentPhone,
  hostelName,
}: ManagerInboxChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer shadow-2xs hover:shadow-xs"
        title={`Open chat with ${studentName}`}
      >
        <span>💬</span>
        <span>Chat Mode</span>
      </button>

      {isOpen && (
        <ChatModal
          chatId={`booking_${bookingId}`}
          title={studentName}
          subtitle={`Student Applicant • ${hostelName}`}
          recipientName={studentName}
          recipientPhone={studentPhone}
          senderRole="MANAGER"
          propertyTitle={hostelName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

