import { notFound } from 'next/navigation';

import MainFooter from '@/components/MainFoooter';
import { ApiError } from '@/lib/api/errors';
import { orderApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';
import type { Order } from '@/types/orders';
import OrderSuccess from '../_components/OrderSuccess';
import OrderSuccessHeader from '../_components/OrderSuccessHeader';

export default async function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const token = await getAccessToken();
  if (!token) notFound();

  let order: Order;

  try {
    order = await orderApi.get(token, orderId);
  } catch (error) {
    /* Someone else's order reads as 403; either way there is nothing to show. */
    if (error instanceof ApiError && (error.isNotFound || error.isForbidden)) notFound();
    throw error;
  }

  return (
    <div className="page-wraper">
      <OrderSuccessHeader />
      <OrderSuccess order={order} />
      <MainFooter />
    </div>
  );
}
