"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addReview } from "@/app/actions/hostel";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  reviewerName: string;
}

export default function ReviewsModal({
  hostelId,
  hostelName,
  reviews,
  canReview,
  onClose,
}: {
  hostelId: string;
  hostelName: string;
  reviews: ReviewItem[];
  canReview: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await addReview(hostelId, rating, comment);
        setSubmitted(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit review.");
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[1.75rem] p-6 max-w-md w-full shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Reviews</h3>
            <p className="text-xs text-slate-500">{hostelName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {canReview && !submitted && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-cyan-50/50 border border-cyan-100 rounded-2xl space-y-3"
          >
            <p className="text-xs font-bold text-slate-700">Leave a review</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl transition ${n <= rating ? "text-amber-400" : "text-slate-200"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience (optional)"
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-cyan-500 resize-none"
            />
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-[#020617] hover:bg-cyan-950 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-bold text-emerald-700 text-center">
            ✓ Thanks for your review!
          </div>
        )}

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">{r.reviewerName}</span>
                  <span className="text-amber-500 text-xs font-bold">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}