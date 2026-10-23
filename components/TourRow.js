'use client';
import { useRef } from 'react';
import TourCard from './TourCard';
import { IconChevronLeft, IconChevronRight } from './Icons';

export default function TourRow({ title, subtitle, tours }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 364, behavior: 'smooth' });
  if (!tours?.length) return null;
  return (
    <section className="section">
      <div className="wrap sec-head">
        <div className="stack gap-8"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        <div className="row gap-8">
          <button type="button" className="round-nav" onClick={() => scroll(-1)} aria-label="Өмнөх"><IconChevronLeft size={20} /></button>
          <button type="button" className="round-nav dark" onClick={() => scroll(1)} aria-label="Дараагийн"><IconChevronRight size={20} /></button>
        </div>
      </div>
      <div className="tour-row" ref={ref}>{tours.map((t) => <TourCard key={t.id} t={t} />)}</div>
    </section>
  );
}
