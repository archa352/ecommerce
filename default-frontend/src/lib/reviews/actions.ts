'use server';

import { revalidateTag } from 'next/cache';

import { reviewApi } from '@/lib/api/reviews';
import { ApiError, ApiUnreachableError } from '@/lib/api/errors';
import { getActionAccessToken } from '@/lib/auth/session';
import type { CheckoutState } from '@/lib/orders/state';

function toState(error: unknown): CheckoutState {
  if (error instanceof ApiError) {
    if (error.isRateLimited) return { status: 'error', message: 'Too many requests. Try again shortly.' };
    return { status: 'error', message: error.message, fieldErrors: error.fieldErrors() };
  }

  if (error instanceof ApiUnreachableError) {
    return { status: 'error', message: 'Could not reach Zeen. Try again in a moment.' };
  }

  throw error;
}

/**
 * Write a review.
 *
 * The backend is the authority on eligibility -- only a delivered purchase
 * earns one, and only one per product -- so its rejection message is shown
 * as-is rather than guessed at here.
 */
export async function submitReview(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in to write a review.' };

  const productId = String(formData.get('product_id') ?? '');
  const rating = Number(formData.get('rating') ?? 0);
  const title = String(formData.get('title') ?? '').trim();
  const comment = String(formData.get('comment') ?? '').trim();

  if (!productId) return { status: 'error', message: 'Missing product.' };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return {
      status: 'error',
      message: 'Choose a star rating.',
      fieldErrors: { rating: 'Pick 1 to 5 stars' },
    };
  }

  try {
    await reviewApi.create(token, {
      product_id: productId,
      rating,
      title: title || null,
      comment: comment || null,
    });
  } catch (error) {
    return toState(error);
  }

  revalidateTag(`reviews:${productId}`);
  return { status: 'success', message: 'Thanks — your review is live.' };
}

export async function deleteReview(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const token = await getActionAccessToken();
  if (!token) return { status: 'error', message: 'Sign in again.' };

  const reviewId = String(formData.get('review_id') ?? '');
  const productId = String(formData.get('product_id') ?? '');

  try {
    await reviewApi.remove(token, reviewId);
  } catch (error) {
    return toState(error);
  }

  revalidateTag(`reviews:${productId}`);
  return { status: 'success', message: 'Review deleted' };
}
