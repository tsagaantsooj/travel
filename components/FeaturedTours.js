'use client';
import { useState } from 'react';
import Link from 'next/link';
import TourCard from './TourCard';

const TABS = [['all', 'Бүгд'], ['abroad', 'Гадаад'], ['domestic', 'Дотоод'], ['day', 'Өдрийн']];

export default function FeaturedTours({ tours }) {
  const [cat, setCat] = useState('all');
  const list = tours.filter((t) => cat === 'all' || t.category === cat);
  return (
    <>
      <div className="section-head">
        <h2>Энэ улирлын аяллууд</h2>
        <div className="segmented" role="group" aria-label="Ангилал">
          {TABS.map(([k, l]) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>
          ))}
        </div>
      </div>
      {list.length ? (
        <div className="tour-grid">{list.map((t) => <TourCard key={t.id} t={t} />)}</div>
      ) : (
        <div className="empty">
          Энэ ангилалд одоогоор нийтлэгдсэн аялал алга.
          <Link href="/tours" className="btn btn-outline">Бүх аяллыг харах</Link>
        </div>
      )}
    </>
  );
}
