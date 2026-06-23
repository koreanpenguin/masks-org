"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReview } from "@/app/actions/review";
import { Button } from "@/components/atoms/Button";
import { t } from "@/lib/translations";
import type { Locale } from "@/store/languageStore";

export interface ReviewData {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill={filled ? "#c17a5a" : "#e8ddd0"}
              className="transition-colors duration-100"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({ review, locale }: { review: ReviewData; locale: Locale }) {
  const date = new Date(review.createdAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-[#2d2926] text-sm">{review.userName}</p>
          <p className="text-xs text-[#8c7b6e] mt-0.5">{date}</p>
        </div>
        <div className="flex shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              width="14"
              height="14"
              viewBox="0 0 20 20"
              fill={s <= review.rating ? "#c17a5a" : "#e8ddd0"}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-sm text-[#6b4f3a] leading-relaxed">{review.comment}</p>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors bg-white";

export function ReviewSection({
  productSlug,
  reviews,
  userName: initialName,
  locale = "en",
}: {
  productSlug: string;
  reviews: ReviewData[];
  userName: string;
  locale?: Locale;
}) {
  const tr = t[locale].reviews;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const err = await submitReview(productSlug, name, rating, comment);
      if (err) {
        setError(err);
      } else {
        setRating(0);
        setComment("");
        setSubmitted(true);
        router.refresh();
        setTimeout(() => setSubmitted(false), 5000);
      }
    });
  }

  return (
    <div id="reviews" className="mt-16 border-t border-[#e8ddd0] pt-12">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[#2d2926]">{tr.heading}</h2>
        {avg !== null && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#c17a5a] font-bold">{avg.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill={s <= Math.round(avg) ? "#c17a5a" : "#e8ddd0"}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#8c7b6e]">
              {reviews.length} {reviews.length !== 1 ? tr.reviews : tr.review}
            </span>
          </div>
        )}
        {avg === null && (
          <span className="text-sm text-[#8c7b6e]">{tr.noReviews}</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h3 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-5">
            {tr.leave}
          </h3>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#f0e8dd] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 44 44" fill="none">
                  <path
                    d="M10 22L18 30L34 14"
                    stroke="#c17a5a"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="font-semibold text-[#2d2926] mb-1">{tr.thankYou}</p>
              <p className="text-sm text-[#8c7b6e]">{tr.posted}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-2">
                  {tr.yourRating}
                </label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
                  {tr.yourName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tr.namePlaceholder}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
                  {tr.yourReview}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={tr.reviewPlaceholder}
                  rows={4}
                  maxLength={800}
                  className={`${inputClass} resize-none`}
                />
                <p className="text-xs text-[#8c7b6e] text-right mt-1">{comment.length}/800</p>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={isPending || rating === 0 || !comment.trim() || !name.trim()}
                onClick={handleSubmit}
              >
                {isPending ? tr.posting : tr.post}
              </Button>
            </div>
          )}
        </div>

        {/* Review list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm text-[#8c7b6e]">
              <p className="text-3xl mb-3">✨</p>
              <p className="font-medium">{tr.beFirst}</p>
            </div>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r} locale={locale} />)
          )}
        </div>
      </div>
    </div>
  );
}
