import { apiRequest, apiRequestPage } from '@/lib/api/client';
import type { Page, PageParams } from '@/types/api';
import type { RatingSummary, Review, ReviewCreate, ReviewUpdate } from '@/types/reviews';

const REVIEW_REVALIDATE = 60;

export const reviewApi = {
  /** Approved reviews for a product. Public. */
  listForProduct(productId: string, params: PageParams = {}): Promise<Page<Review>> {
    return apiRequestPage<Review>(`/reviews/product/${productId}`, {
      query: { ...params },
      revalidate: REVIEW_REVALIDATE,
      tags: [`reviews:${productId}`],
    });
  },

  summary(productId: string): Promise<RatingSummary> {
    return apiRequest<RatingSummary>(`/reviews/product/${productId}/summary`, {
      revalidate: REVIEW_REVALIDATE,
      tags: [`reviews:${productId}`],
    });
  },

  /** Only a delivered product may be reviewed, and it starts unapproved. */
  create(token: string, data: ReviewCreate): Promise<Review> {
    return apiRequest<Review>('/reviews', {
      method: 'POST',
      body: data,
      token,
      cache: 'no-store',
    });
  },

  update(token: string, reviewId: string, data: ReviewUpdate): Promise<Review> {
    return apiRequest<Review>(`/reviews/${reviewId}`, {
      method: 'PATCH',
      body: data,
      token,
      cache: 'no-store',
    });
  },

  remove(token: string, reviewId: string): Promise<null> {
    return apiRequest<null>(`/reviews/${reviewId}`, {
      method: 'DELETE',
      token,
      cache: 'no-store',
    });
  },
};
