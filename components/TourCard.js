'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { IconPin, IconChevronLeft, IconChevronRight } from './Icons';
import { money, range, duration, PACKAGE } from '@/lib/format';

export default function TourCard({ t, enter = false, delay = 0 }) {
  const imgs = t.images?.length ? t.images : t.coverImageUrl ? [t.coverImageUrl] : [];
  const [i, setI] = useState(0);
  const touch = useRef(null);
  const go = (d) => (e) => { e.preventDefault(); e.stopPropagation(); setI((v) => (v + d + imgs.length) % imgs.length); };
  const pkgs = t.packageTypes || [];

  return (
    <article className={`tcard${enter ? ' enter' : ''}`} style={enter ? { animationDelay: `${delay}ms` } : undefined}>
      <div className="media"
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touch.current === null || imgs.length < 2) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) setI((v) => (v + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
          touch.current = null;
        }}>
        {imgs.length ? imgs.map((src, k) => <img key={src} src={src} alt="" className={k === i ? 'on' : ''} loading={k === 0 ? 'eager' : 'lazy'} />) : <span className="pattern" />}
        <div className="tags">
          {pkgs.length === 1 && <span>{PACKAGE[pkgs[0]]}</span>}
          {pkgs.length > 1 && <span>Хөтөлбөртэй, чөлөөт</span>}
          {t.badge && <span className="hot">{t.badge}</span>}
        </div>
        <span className="days">{duration(t.days, t.nights)}</span>
        {imgs.length > 1 && (
          <>
            <button type="button" className="swipe l" onClick={go(-1)} aria-label="Өмнөх зураг"><IconChevronLeft size={18} /></button>
            <button type="button" className="swipe r" onClick={go(1)} aria-label="Дараагийн зураг"><IconChevronRight size={18} /></button>
            <div className="dots" aria-hidden="true">{imgs.map((src, k) => <span key={src} className={k === i ? 'on' : ''} />)}</div>
          </>
        )}
      </div>
      <Link href={`/tours/${t.slug}`} className="body">
        <span className="place"><IconPin size={15} />{t.country}</span>
        <h3>{t.title}</h3>
        <span className="when">{t.nextStart ? `Ойрын хуваарь: ${range(t.nextStart, t.nextEnd, { year: false })}` : 'Хуваарь удахгүй'}</span>
        <span className="foot">
          <span><small>Үнэ / хүн</small><b>{t.minPrice ? money(t.minPrice) : '—'}</b></span>
          <span className="go">Дэлгэрэнгүй →</span>
        </span>
      </Link>
    </article>
  );
}
