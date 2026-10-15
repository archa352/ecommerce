'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

import { deleteReview, submitReview } from '@/lib/reviews/actions';
import { formatDate } from '@/lib/format';
import type { RatingSummary, Review } from '@/types/reviews';

import homeStyles from '@/app/(storefront)/(home)/home/_components/luxe/Home.module.css';
import productStyles from './luxe/Product.module.css';

const initialState = { status: 'idle' as const, message: null as string | null };

function Stars({ value }: { value: number }) {
  return (
    <span className={productStyles.stars}>
      {Array.from({ length: 5 }).map((_, index) => (
        <i key={index} className={index < value ? 'fa-solid fa-star filled' : 'fa-regular fa-star'} />
      ))}
    </span>
  );
}

/** Clickable 1-5 star input, since there is no rating input elsewhere to match. */
function StarPicker({ name, value, onChange }: { name: string; value: number; onChange: (value: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className={productStyles.starPicker} onMouseLeave={() => setHover(0)}>
      <input type="hidden" name={name} value={value} />
      {Array.from({ length: 5 }).map((_, index) => {
        const star = index + 1;
        const filled = star <= (hover || value);

        return (
          <i
            key={star}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
            className={filled ? 'fa-solid fa-star filled' : 'fa-regular fa-star'}
          />
        );
      })}
    </div>
  );
}

function WriteReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (state.status === 'success') router.refresh();
  }, [state, router]);

  if (state.status === 'success') {
    return <p className={productStyles.message}>{state.message}</p>;
  }

  return (
    <form action={formAction} className={productStyles.reviewForm}>
      <input type="hidden" name="product_id" value={productId} />

      <div className={productStyles.formField}>
        <p>Your rating</p>
        <StarPicker name="rating" value={rating} onChange={setRating} />
        {state.fieldErrors?.rating && <p className={productStyles.message}>{state.fieldErrors.rating}</p>}
      </div>

      <div className={productStyles.formField}>
        <input type="text" name="title" maxLength={150} placeholder="Title (optional)" className={productStyles.formInput} />
      </div>

      <div className={productStyles.formField}>
        <textarea
          name="comment"
          maxLength={2000}
          rows={4}
          placeholder="Tell others what you thought"
          className={productStyles.formTextarea}
        />
      </div>

      {state.message && state.status === 'error' && <p className={productStyles.message}>{state.message}</p>}

      <button type="submit" disabled={pending} className={productStyles.addToCartBtn}>
        {pending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

function DeleteReviewButton({ reviewId, productId }: { reviewId: string; productId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteReview, initialState);

  useEffect(() => {
    if (state.status === 'success') router.refresh();
  }, [state, router]);

  return (
    <form action={formAction}>
      <input type="hidden" name="review_id" value={reviewId} />
      <input type="hidden" name="product_id" value={productId} />
      <button type="submit" disabled={pending} className={productStyles.deleteLink}>
        {pending ? 'Deleting...' : 'Delete'}
      </button>
    </form>
  );
}

export default function ProductReviews({
  productId,
  reviews,
  summary,
  currentUserId,
}: {
  productId: string;
  reviews: Review[];
  summary: RatingSummary | null;
  currentUserId: string | null;
}) {
  const total = summary?.total_reviews ?? 0;

  return (
    <section className={productStyles.reviewsSection}>
      <div className={homeStyles.container}>
        <h2 className={productStyles.reviewsHeading}>Reviews ({total})</h2>

        {summary && total > 0 && (
          <div className={productStyles.reviewsSummary}>
            <Stars value={Math.round(summary.average_rating)} />
            <span>{summary.average_rating.toFixed(1)} out of 5</span>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className={productStyles.reviewsEmpty}>No reviews yet. Be the first to share your thoughts.</p>
        ) : (
          <div>
            {reviews.map(review => (
              <div key={review.id} className={productStyles.reviewRow}>
                <Stars value={review.rating} />
                {review.is_verified_purchase && <span className={productStyles.verifiedBadge}>Verified purchase</span>}
                {review.title && <p className={productStyles.reviewTitle}>{review.title}</p>}
                {review.comment && <p className={productStyles.reviewComment}>{review.comment}</p>}
                <p className={productStyles.reviewMeta}>{formatDate(review.created_at)}</p>
                {currentUserId && review.user_id === currentUserId && (
                  <DeleteReviewButton reviewId={review.id} productId={productId} />
                )}
              </div>
            ))}
          </div>
        )}

        {currentUserId ? (
          <WriteReviewForm productId={productId} />
        ) : (
          <p className={productStyles.signInPrompt}>
            <Link href={`/signin?next=/single-product/${productId}`}>Sign in</Link> to write a review.
          </p>
        )}
      </div>
    </section>
  );
}
