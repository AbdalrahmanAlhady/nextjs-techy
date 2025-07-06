import React, { useState, useTransition } from 'react';
import StarRatingInput from './StarRatingInput';

interface OrderItemReviewFormProps {
  productId: string;
  productName: string;
  alreadyReviewed: boolean;
  onReviewSubmit: () => void;
}

export default function OrderItemReviewForm({ productId, productName, alreadyReviewed, onReviewSubmit }: OrderItemReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (alreadyReviewed) {
    return <div className="text-green-600 text-sm mt-2">You have reviewed this product.</div>;
  }

  return (
    <form
      className="mt-2 p-3 bg-gray-50 rounded border"
      onSubmit={e => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        startTransition(async () => {
          const { submitReview } = await import('@/app/actions/submit-review');
          const result = await submitReview({ productId, rating, comment });
          if (result.success) {
            setSuccess(true);
            setRating(0);
            setComment('');
            onReviewSubmit();
            setTimeout(() => setSuccess(false), 2000);
          } else {
            setError(result.error || 'Failed to submit review');
          }
        });
      }}
    >
      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm">Rate {productName}</label>
        <StarRatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        className="w-full border rounded p-2 mt-1 text-sm"
        rows={2}
        placeholder="Write a review (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      {error && <div className="text-danger text-xs mt-1">{error}</div>}
      {success && <div className="text-success text-xs mt-1">Review submitted!</div>}
      <button
        type="submit"
        className="mt-2 bg-primary text-white px-4 py-1 rounded text-sm disabled:opacity-60"
        disabled={isPending || rating === 0}
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
