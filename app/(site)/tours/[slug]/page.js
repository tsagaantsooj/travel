import { notFound } from 'next/navigation';
import { apiServer } from '@/lib/api';
import TourDetailView from '@/components/TourDetailView';

export const dynamic = 'force-dynamic';

async function load(slug) {
  return apiServer(`/tours/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({ params }) {
  const d = await load(params.slug).catch(() => null);
  if (!d) return { title: 'Аялал олдсонгүй' };
  return {
    title: d.tour.title,
    description: d.tour.summary || `${d.tour.country} — ${d.tour.days} өдрийн аялал`,
    openGraph: d.tour.coverImageUrl ? { images: [d.tour.coverImageUrl] } : undefined,
  };
}

export default async function TourPage({ params }) {
  const data = await load(params.slug);
  if (!data) notFound();
  return <TourDetailView data={data} />;
}
