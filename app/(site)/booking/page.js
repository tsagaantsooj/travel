import { Suspense } from 'react';
import BookingFlow from '@/components/BookingFlow';

export const metadata = { title: 'Захиалга' };

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="page soft-page"><div className="container"><div className="spinner" /></div></div>}>
      <BookingFlow />
    </Suspense>
  );
}
