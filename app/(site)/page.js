import { apiServer } from '@/lib/api';
import HeroSlider from '@/components/HeroSlider';
import TrustStrip from '@/components/TrustStrip';
import Destinations from '@/components/Destinations';
import TourRow from '@/components/TourRow';
import Promotions from '@/components/Promotions';
import CustomTripForm from '@/components/CustomTripForm';
import { money, range, duration } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [tours, dest, site] = await Promise.all([
    apiServer('/tours?limit=24').catch(() => []),
    apiServer('/tours/destinations').catch(() => []),
    apiServer('/site').catch(() => ({ settings: {}, promotions: [] })),
  ]);
  const s = site?.settings || {};
  const list = tours || [];

  // Слайд: онцлох аяллууд (зурагтай). Байхгүй бол сайтын тохиргооны hero.
  let slides = list.filter((t) => t.isFeatured && (t.images?.[0] || t.coverImageUrl)).slice(0, 5).map((t) => ({
    img: t.images?.[1] || t.images?.[0] || t.coverImageUrl,
    label: t.badge || 'Онцлох аялал',
    title: t.title,
    desc: t.summary || `${t.country}, ${duration(t.days, t.nights)}`,
    meta: [t.nextStart && range(t.nextStart, t.nextEnd, { year: false }), t.minPrice && `${money(t.minPrice)}-с`].filter(Boolean).join(' · '),
    href: `/tours/${t.slug}`,
  }));
  if (!slides.length) {
    slides = [{ img: s.hero_image_url || list.find((t) => t.coverImageUrl)?.coverImageUrl, label: s.tagline || 'Тавтай морил', title: s.hero_title || 'Аялъя, амаръя, дурсамж бүтээе', desc: s.hero_subtitle, href: '/tours' }];
  }

  const abroad = list.filter((t) => t.category === 'abroad');
  const domestic = list.filter((t) => t.category !== 'abroad');

  return (
    <>
      <HeroSlider slides={slides} />
      <TrustStrip />
      <Destinations items={dest} />
      <TourRow title="Гадаад аялал" subtitle="Зураг дээр гүйлгээд аяллаа урьдчилан мэдэр." tours={abroad} />
      <TourRow title="Монголоо нээж аялъя" subtitle="Дотоодын болон өдрийн аялал." tours={domestic} />
      <Promotions items={site?.promotions} />
      <CustomTripForm />
    </>
  );
}
