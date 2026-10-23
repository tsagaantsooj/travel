import Link from 'next/link';
import { IconArrowRight } from './Icons';

export default function Promotions({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section wrap" id="offers">
      <div className="sec-head"><h2>Хөнгөлөлт, урамшуулал</h2><p>Хугацаатай санал, тусгай нөхцөлүүд.</p></div>
      <div className="promo-grid">
        {items.slice(0, 6).map((p) => {
          const inner = (
            <>
              {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" />}
              <h3>{p.title}</h3>
              {p.subtitle && <p>{p.subtitle}</p>}
              {p.buttonText && <span className={`btn promo-btn-${p.tone}`}>{p.buttonText} <IconArrowRight size={16} /></span>}
            </>
          );
          const cls = `promo${p.imageUrl ? '' : ` no-img tone-${p.tone}-bg`}`;
          return p.linkUrl ? <Link key={p.id} href={p.linkUrl} className={cls}>{inner}</Link> : <div key={p.id} className={cls}>{inner}</div>;
        })}
      </div>
    </section>
  );
}
