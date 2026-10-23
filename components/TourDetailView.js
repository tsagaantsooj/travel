'use client';
import { useEffect, useState } from 'react';
import { track } from '@/lib/site';
import Link from 'next/link';
import Lightbox from './Lightbox';
import PriceBox from './PriceBox';
import { IconPin, IconClock, IconPlane, IconHotel, IconCheck, IconClose, IconGrid, IconImage, IconFile } from './Icons';
import { money, duration, CATEGORY } from '@/lib/format';

const MEALS = [['hasBreakfast', 'Өглөө'], ['hasLunch', 'Өдөр'], ['hasDinner', 'Орой']];

export default function TourDetailView({ data }) {
  const { tour, days, images, inclusions, options, departures, minPrice } = data;
  const [lb, setLb] = useState(-1);
  useEffect(() => { track('ViewContent', { content_name: tour.title, content_ids: [tour.slug], content_type: 'product', value: minPrice || 0, currency: 'MNT' }); }, [tour.slug, tour.title, minPrice]);
  const gallery = images.map((i) => ({ ...i, alt: i.alt || tour.title }));
  const indexOf = (id) => gallery.findIndex((g) => g.id === id);
  const [big, ...rest] = gallery;
  const smalls = rest.slice(0, 4);

  return (
    <div className="page has-bar">
      <div className="container">
        <nav className="crumbs" aria-label="Замын мөр">
          <Link href="/">Нүүр</Link><span aria-hidden="true">/</span>
          <Link href={`/tours?category=${tour.category}`}>{CATEGORY[tour.category]}</Link><span aria-hidden="true">/</span>
          <span style={{ color: 'var(--ink)' }}>{tour.title}</span>
        </nav>

        <div className="row between gap-20" style={{ alignItems: 'flex-end' }}>
          <div className="stack gap-16">
            <h1 className="title-xl">{tour.title}</h1>
            <div className="row gap-8">
              <span className="chip"><IconPin size={16} />{tour.country}</span>
              <span className="chip"><IconClock size={16} />{duration(tour.days, tour.nights)}</span>
              {tour.badge && <span className="chip"><IconPlane size={16} />{tour.badge}</span>}
            </div>
            {tour.summary && <p className="muted" style={{ maxWidth: 640, fontSize: 17 }}>{tour.summary}</p>}
          </div>
          <div className="stack gap-12" style={{ alignItems: 'flex-end' }}>
            {minPrice && (
              <div className="stack" style={{ alignItems: 'flex-end' }}>
                <span className="price-label">Эхлэх үнэ</span>
                <span className="serif" style={{ fontWeight: 700, fontSize: 34, color: 'var(--ink)' }}>{money(minPrice)}</span>
              </div>
            )}
            <a href={`/print/${tour.slug}`} target="_blank" rel="noopener" className="btn btn-outline"><IconFile /> Хөтөлбөр PDF</a>
          </div>
        </div>

        {big ? (
          <div className="gallery">
            <button type="button" className="zoom big" onClick={() => setLb(0)} aria-label={`${big.alt} — томруулж харах`}>
              <img src={big.url} alt="" />
            </button>
            {smalls.length > 0 && (
              <div className="smalls">
                {smalls.map((g, i) => {
                  const last = i === smalls.length - 1 && gallery.length > 5;
                  return (
                    <button key={g.id} type="button" className="zoom" onClick={() => setLb(i + 1)}
                      aria-label={last ? `Бүх ${gallery.length} зургийг харах` : `${g.alt} — томруулж харах`}>
                      <img src={g.url} alt="" />
                      {last && <span className="more"><IconGrid size={26} />Бүх зураг ({gallery.length})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="gallery"><div className="zoom big" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', cursor: 'default' }}><IconImage size={40} /></div></div>
        )}

        <div className="detail-layout">
          <div className="detail-main">
            {days.length > 0 && (
              <section className="stack gap-24" aria-labelledby="h-program">
                <h2 id="h-program" className="h2">Аяллын хөтөлбөр</h2>
                <div className="timeline">
                  {days.map((d, i) => (
                    <article key={d.id}>
                      <div className="rail">
                        <span className={`dot${d.isFreeDay ? ' free' : ''}`}>{d.dayNo}</span>
                        {i < days.length - 1 && <span className="line" />}
                      </div>
                      <div className="content">
                        <div className="stack gap-4" style={{ paddingTop: 6 }}>
                          <span className="daynum">Өдөр {d.dayNo}</span>
                          <h3>{d.title}</h3>
                        </div>
                        {d.description && <p>{d.description}</p>}
                        <div className="row gap-8">
                          {MEALS.map(([k, l]) => <span key={k} className={`meal${d[k] ? ' on' : ''}`}>{l}</span>)}
                          {d.hotelText && <span className="row gap-4 muted" style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}><IconHotel size={16} />{d.hotelText}</span>}
                        </div>
                        {d.images.length > 0 && (
                          <div className="day-images">
                            {d.images.map((im) => (
                              <button key={im.id} type="button" className="zoom" onClick={() => setLb(indexOf(im.id))} aria-label={`${im.alt || d.title} — томруулж харах`}>
                                <img src={im.url} alt="" loading="lazy" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {(inclusions.included.length > 0 || inclusions.excluded.length > 0) && (
              <section className="incl-grid">
                {inclusions.included.length > 0 && (
                  <div className="box">
                    <h2>Үнэд багтсан</h2>
                    <ul className="ticks">{inclusions.included.map((t) => <li key={t}><IconCheck style={{ color: 'var(--teal)' }} />{t}</li>)}</ul>
                  </div>
                )}
                {inclusions.excluded.length > 0 && (
                  <div className="box">
                    <h2>Үнэд багтаагүй</h2>
                    <ul className="ticks">{inclusions.excluded.map((t) => <li key={t}><IconClose style={{ color: '#B23A12' }} />{t}</li>)}</ul>
                  </div>
                )}
              </section>
            )}

            {(inclusions.notes.length > 0 || options.some((o) => o.singleSupplement > 0)) && (
              <section className="note-box">
                <h2>Анхаарах зүйлс</h2>
                <ul>
                  {options.some((o) => o.singleSupplement > 0) && (
                    <li>Өрөөнд ганцаараа байрлах нэмэлт төлбөр: {
                      [...new Map(options.filter((o) => o.singleSupplement > 0).map((o) => [o.hotelId, o])).values()]
                        .map((o) => `${o.hotelName || 'Буудал'} — ${money(o.singleSupplement)}`).join(', ')}</li>
                  )}
                  {inclusions.notes.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </section>
            )}
          </div>

          <PriceBox options={options} departures={departures} />
        </div>
      </div>

      {lb >= 0 && <Lightbox images={gallery} index={lb} onChange={setLb} onClose={() => setLb(-1)} />}
    </div>
  );
}
