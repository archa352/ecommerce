import { notFound } from 'next/navigation';

import CommonBanner2 from '@/components/CommonBanner2';
import { ApiError } from '@/lib/api/errors';
import { orderApi } from '@/lib/api/orders';
import { getAccessToken } from '@/lib/auth/session';
import type { Order } from '@/types/orders';
import Invoice from '../_components/Invoice';

export default async function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const token = await getAccessToken();
  if (!token) notFound();

  let order: Order;

  try {
    order = await orderApi.get(token, orderId);
  } catch (error) {
    if (error instanceof ApiError && (error.isNotFound || error.isForbidden)) notFound();
    throw error;
  }

  return (
    <>
      <CommonBanner2 parentText="Orders" currentText="Invoice" mainText="Shop Standard" />
      <Invoice order={order} />
    </>
  );
}
