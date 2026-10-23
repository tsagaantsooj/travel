'use client';
import { useEffect, useRef } from 'react';
import { IconClose, IconChevronLeft, IconChevronRight } from './Icons';

export default function Lightbox({ images, index, onChange, onClose }) {
  const n = images.length;
  const touch = useRef(null);
  const closeRef = useRef(null);
  const img = images[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onChange((index - 1 + n) % n);
      if (e.key === 'ArrowRight') onChange((index + 1) % n);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [index, n, onChange, onClose]);

  useEffect(() => { closeRef.current?.focus(); }, []);

  if (!img) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Зургийн цомог"
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) onChange(dx > 0 ? (index - 1 + n) % n : (index + 1) % n);
        touch.current = null;
      }}>
      <div className="top">
        <b style={{ minWidth: 60 }}>{index + 1} / {n}</b>
        <span className="serif" style={{ fontSize: 19, fontWeight: 600, textAlign: 'center' }}>{img.alt || ''}</span>
        <button ref={closeRef} type="button" className="lb-btn" onClick={onClose} aria-label="Хаах"><IconClose size={22} /></button>
      </div>
      <div className="stage">
        <button type="button" className="lb-btn" onClick={() => onChange((index - 1 + n) % n)} aria-label="Өмнөх зураг"><IconChevronLeft size={24} /></button>
        <img src={img.url} alt={img.alt || ''} />
        <button type="button" className="lb-btn" onClick={() => onChange((index + 1) % n)} aria-label="Дараагийн зураг"><IconChevronRight size={24} /></button>
      </div>
      <div className="thumbs">
        {images.map((im, i) => (
          <button key={im.id ?? i} type="button" aria-current={i === index} aria-label={`${i + 1}-р зураг`} onClick={() => onChange(i)}>
            <img src={im.url} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
