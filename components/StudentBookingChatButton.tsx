"use client";

import { useState } from "react";
import ChatModal from "./ChatModal";

interface StudentBookingChatButtonProps {
  bookingId: string;
  hostelName: string;
  ownerPhone?: string | null;
}

export default function StudentBookingChatButton({
  bookingId,
  hostelName,
  ownerPhone,
}: StudentBookingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-2xs hover:shadow transition cursor-pointer"
        title={`Chat with manager of ${hostelName}`}
      >
        <span>💬</span>
        <span>Chat Mode</span>
      </button>

      {isOpen && (
        <ChatModal
          chatId={`booking_${bookingId}`}
          title={hostelName}
          subtitle={`Bed Request • Manager Inquiry`}
          recipientName={`Manager of ${hostelName}`}
          recipientPhone={ownerPhone}
          senderRole="STUDENT"
          propertyTitle={hostelName}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

