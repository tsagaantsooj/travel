import Link from 'next/link';
import { money } from '@/lib/format';

export default function Destinations({ items }) {
  if (!items?.length) return null;
  const list = items.slice(0, 5);
  return (
    <section className="section wrap">
      <div className="sec-head">
        <h2 style={{ maxWidth: 560 }}>Хаашаа аялахыг хүсэж байна?</h2>
        <p>Чиглэлээ сонгоод тухайн орны бүх хөтөлбөр, хуваарийг нэг дор харьцуулаарай.</p>
        <Link href="/tours" className="pill-outline">Бүх аялал →</Link>
      </div>
      <div className={`dest-grid n${list.length}`}>
        {list.map((d, k) => (
          <Link key={d.country} href={`/tours?country=${encodeURIComponent(d.country)}`} className={`dest${k === 0 && list.length > 1 ? ' big' : ''}`}>
            {d.coverImageUrl ? <img className="bg" src={d.coverImageUrl} alt="" loading="lazy" /> : <span className="pattern" />}
            <span className="count">{d.tours} хөтөлбөр</span>
            <span className="info">
              <span><b>{d.country}</b>{d.minPrice && <span>{money(d.minPrice)}-с</span>}</span>
              <span className="more">Аялал үзэх →</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
