'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { IconChevronLeft, IconChevronRight, IconArrowRight } from './Icons';

/**
 * slides: [{ img, label, title, desc, meta, href }]
 * Прогресс зураас дүүрэхэд (animationend) дараагийн слайд руу шилжинэ — таймергүй.
 */
export default function HeroSlider({ slides }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((k) => setI(((k % n) + n) % n), [n]);
  if (!n) return null;
  const nextTwo = n > 1 ? [1, 2].filter((d) => d < n).map((d) => ({ ...slides[(i + d) % n], k: (i + d) % n, kicker: d === 1 ? 'Дараагийн' : slides[(i + d) % n].label })) : [];

  return (
    <div className="hero-wrap">
      <section className="hero" aria-roledescription="carousel" aria-label="Онцлох аяллууд">
        {slides.map((s, k) => (
          <div key={s.href + k} className={`slide${k === i ? ' on' : ''}`} aria-hidden={k !== i}>
            {s.img && <img src={s.img} alt="" />}
          </div>
        ))}

        {n > 1 && (
          <div className="arrows">
            <button type="button" className="glass glass-btn" onClick={() => go(i - 1)} aria-label="Өмнөх слайд"><IconChevronLeft size={22} /></button>
            <button type="button" className="glass glass-btn" onClick={() => go(i + 1)} aria-label="Дараагийн слайд"><IconChevronRight size={22} /></button>
          </div>
        )}

        <div className="copy rise" key={i}>
          <span className="eyebrow">{slides[i].label}</span>
          <h1>{slides[i].title}</h1>
          {slides[i].desc && <p>{slides[i].desc}</p>}
          <div className="row gap-12" style={{ marginTop: 6 }}>
            <Link href={slides[i].href} className="btn-sun">Дэлгэрэнгүй <IconArrowRight size={18} /></Link>
            {slides[i].meta && <span className="glass" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 54, padding: '0 22px', borderRadius: 999, fontWeight: 700 }}>{slides[i].meta}</span>}
          </div>
        </div>

        {n > 1 && (
          <div className="progress">
            <div className="bars" role="tablist" aria-label="Слайд сонгох">
              {slides.map((s, k) => (
                <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={s.title} onClick={() => go(k)}>
                  <span className="track">
                    <span className="done" style={{ width: k < i ? '100%' : '0%' }} />
                    {k === i && <span className="fill" onAnimationEnd={() => go(i + 1)} />}
                  </span>
                </button>
              ))}
            </div>
            <span>{String(i + 1).padStart(2, '0')} <span style={{ opacity: .6 }}>/ {String(n).padStart(2, '0')}</span></span>
          </div>
        )}

        {nextTwo.length > 0 && (
          <div className="thumbs">
            {nextTwo.map((s) => (
              <button key={s.k} type="button" className="glass" onClick={() => go(s.k)}>
                {s.img && <img src={s.img} alt="" />}
                <span><small>{s.kicker}</small><b>{s.title}</b></span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
