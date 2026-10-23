import { apiServer } from '@/lib/api';
import ToursBrowser from '@/components/ToursBrowser';
import { CATEGORY } from '@/lib/format';

export const dynamic = 'force-dynamic';

const TEXT = {
  abroad: ['Гадаад аялал', 'Далайн амралт, хотын аялал. Нислэг, буудал, хөтөлбөр бүгд нэг дор.'],
  domestic: ['Дотоод аялал', 'Монголынхоо үзэсгэлэнт газруудаар аялаарай.'],
  day: ['Өдрийн аялал', 'Нэг өдрийн богино аяллууд.'],
};

export async function generateMetadata({ searchParams }) {
  return { title: CATEGORY[searchParams?.category] || 'Бүх аялал' };
}

export default async function ToursPage({ searchParams }) {
  const cat = ['abroad', 'domestic', 'day'].includes(searchParams?.category) ? searchParams.category : '';
  const tours = await apiServer(`/tours?limit=100${cat ? `&category=${cat}` : ''}`).catch(() => []);
  const [title, sub] = TEXT[cat] || ['Бүх аялал', 'Гадаад, дотоод бүх хөтөлбөр нэг дор.'];
  const banner = (tours || []).find((t) => t.images?.[2] || t.coverImageUrl);
  const img = banner ? (banner.images?.[2] || banner.coverImageUrl) : null;

  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: '8px 24px 0' }}>
        <section className="banner">
          {img && <img src={img} alt="" />}
          <div className="in">
            <nav aria-label="Замын мөр" style={{ fontSize: 14, fontWeight: 600, opacity: .85 }}><a href="/">Нүүр</a> / {title}</nav>
            <h1>{title}</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>{sub}</p>
          </div>
        </section>
      </div>
      <ToursBrowser key={cat} tours={tours || []} initial={{ category: cat, country: searchParams?.country, month: searchParams?.month, pkg: searchParams?.pkg }} />
    </div>
  );
}
