import { notFound } from 'next/navigation';
import { apiServer } from '@/lib/api';
import PrintButton from '@/components/PrintButton';
import { money, range, duration, hotelLabel, PACKAGE } from '@/lib/format';
import './print.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const d = await apiServer(`/tours/${encodeURIComponent(params.slug)}`).catch(() => null);
  return { title: d ? `${d.tour.title} — хөтөлбөр` : 'Хөтөлбөр', robots: { index: false } };
}

const MEALS = [['hasBreakfast', 'өглөөний цай'], ['hasLunch', 'өдрийн хоол'], ['hasDinner', 'оройн хоол']];

export default async function PrintPage({ params, searchParams }) {
  const [data, site] = await Promise.all([
    apiServer(`/tours/${encodeURIComponent(params.slug)}`),
    apiServer('/site').catch(() => ({ settings: {} })),
  ]);
  if (!data) notFound();
  const { tour, days, images, inclusions, options, departures } = data;
  const s = site?.settings || {};
  const cover = tour.coverImageUrl || images[0]?.url;

  return (
    <div className="brochure">
      <PrintButton auto={searchParams?.auto === '1'} />

      <section className="sheet cover">
        {cover && <img className="cover-img" src={cover} alt="" />}
        <div className="cover-body">
          <div className="brand-line">{s.company_name || 'Batbileg Travel'}</div>
          <h1>{tour.title}</h1>
          <div className="chips"><span>{tour.country}</span><span>{duration(tour.days, tour.nights)}</span>{tour.badge && <span>{tour.badge}</span>}</div>
          {tour.summary && <p className="lead">{tour.summary}</p>}
        </div>
      </section>

      <section className="sheet pb">
        <h2>Аяллын хөтөлбөр</h2>
        {days.map((d) => {
          const meals = MEALS.filter(([k]) => d[k]).map(([, l]) => l);
          const img = d.images[0];
          return (
            <article key={d.id} className="day">
              <div className="day-head"><span className="num">Өдөр {d.dayNo}</span><h3>{d.title}</h3></div>
              <div className={`day-body${img ? ' with-img' : ''}`}>
                <div>
                  {d.description && <p>{d.description}</p>}
                  {d.hotelText && <p className="meta"><b>Байрлах буудал:</b> {d.hotelText}</p>}
                  <p className="meta"><b>Хоол:</b> {meals.length ? meals.join(', ') : 'ороогүй'}</p>
                </div>
                {img && <img src={img.url} alt="" />}
              </div>
            </article>
          );
        })}
      </section>

      {options.filter((o) => departures.some((d) => d.prices[o.id])).map((o, idx) => {
        const rows = departures.filter((d) => d.prices[o.id]);
        return (
          <section key={o.id} className={`sheet keep${idx === 0 ? ' pb' : ''}`}>
            <h2>{[PACKAGE[o.packageType], hotelLabel(o.hotelName, o.hotelStars)].filter(Boolean).join(' · ')} — үнэ</h2>
            <table className="prices">
              <thead><tr><th>Хуваарь</th><th>Том хүн<br /><small>12-оос дээш</small></th><th>Хүүхэд<br /><small>2–11 нас</small></th><th>Нярай<br /><small>0–1.99 нас</small></th></tr></thead>
              <tbody>
                {rows.map((d) => {
                  const p = d.prices[o.id];
                  return <tr key={d.id}><td>{range(d.startDate, d.endDate)}</td><td>{money(p.adult)}</td><td>{money(p.child)}</td><td>{money(p.infant)}</td></tr>;
                })}
              </tbody>
            </table>
            {o.singleSupplement > 0 && <p className="meta">Өрөөнд ганцаараа байрлах нэмэлт төлбөр: <b>{money(o.singleSupplement)}</b></p>}
          </section>
        );
      })}

      <section className="sheet keep">
        <div className="two">
          {inclusions.included.length > 0 && <div><h2>Үнэд багтсан</h2><ul>{inclusions.included.map((t) => <li key={t}>{t}</li>)}</ul></div>}
          {inclusions.excluded.length > 0 && <div><h2>Үнэд багтаагүй</h2><ul>{inclusions.excluded.map((t) => <li key={t}>{t}</li>)}</ul></div>}
        </div>
        {inclusions.notes.length > 0 && <div className="notes"><h2>Анхаарах зүйлс</h2><ul>{inclusions.notes.map((t) => <li key={t}>{t}</li>)}</ul></div>}
        <div className="contact">
          <b>{s.company_name || 'Batbileg Travel'}</b>
          {s.phone && <span>Утас: {s.phone}{s.phone2 ? `, ${s.phone2}` : ''}</span>}
          {s.email && <span>И-мэйл: {s.email}</span>}
          {s.address && <span>{s.address}</span>}
          {s.facebook_url && <span>{s.facebook_url}</span>}
        </div>
      </section>
    </div>
  );
}
