'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { calcQuote } from '@/lib/pricing';
import { track } from '@/lib/site';
import { money, range, hotelLabel, PACKAGE } from '@/lib/format';

export default function PriceBox({ options, departures }) {
  // Буудлын жагсаалт (hotel_id-гаар бүлэглэнэ)
  const hotels = useMemo(() => {
    const m = new Map();
    options.forEach((o) => { const k = o.hotelId ?? 0; if (!m.has(k)) m.set(k, { id: k, label: hotelLabel(o.hotelName, o.hotelStars) || 'Буудалгүй' }); });
    return [...m.values()];
  }, [options]);

  const firstBookable = useMemo(() => {
    for (const d of departures) for (const o of options) if (d.prices[o.id] && d.seatsLeft !== 0) return { d, o };
    return null;
  }, [departures, options]);

  const [hotelId, setHotelId] = useState(firstBookable ? (firstBookable.o.hotelId ?? 0) : hotels[0]?.id);
  const [pkg, setPkg] = useState(firstBookable ? firstBookable.o.packageType : options[0]?.packageType);
  const [depId, setDepId] = useState(firstBookable?.d.id ?? departures[0]?.id);
  const [pax, setPax] = useState({ adults: 2, children: 0, infants: 0 });
  const [single, setSingle] = useState(false);

  const pkgsForHotel = options.filter((o) => (o.hotelId ?? 0) === hotelId);
  const option = pkgsForHotel.find((o) => o.packageType === pkg) || pkgsForHotel[0];
  const dep = departures.find((d) => d.id === depId);
  const price = dep && option ? dep.prices[option.id] : null;
  const seatsOk = !dep || dep.seatsLeft === null || dep.seatsLeft >= pax.adults + pax.children;
  const q = price ? calcQuote({ ...price, singleSupplement: option.singleSupplement }, { ...pax, singleRoom: single }) : null;

  const step = (k, delta, min, max = 9) => setPax((p) => ({ ...p, [k]: Math.min(max, Math.max(min, p[k] + delta)) }));

  const href = (t) => option && dep
    ? `/booking?d=${dep.id}&o=${option.id}&a=${pax.adults}&c=${pax.children}&i=${pax.infants}&s=${single ? 1 : 0}&t=${t}`
    : '#';

  if (!departures.length || !options.length) {
    return (
      <aside className="price-box" id="price"><div className="body">
        <b>Хуваарь тун удахгүй гарна.</b>
        <p className="muted">Мэдээлэл авахыг хүсвэл бидэнтэй холбогдоорой.</p>
      </div></aside>
    );
  }

  return (
    <>
      <aside className="price-box" id="price" aria-label="Үнэ тооцоолох">
        <div className="head">
          <div><small>1 том хүн</small><b>{price ? money(price.adult) : '—'}</b></div>
          {dep && <span className="pill">{range(dep.startDate, dep.endDate, { year: false })}</span>}
        </div>
        <div className="body">
          {hotels.length > 1 && (
            <div>
              <div className="pb-label" id="lbl-hotel">Буудал</div>
              <div className="choice-grid" role="group" aria-labelledby="lbl-hotel">
                {hotels.map((h) => (
                  <button key={h.id} type="button" className="choice" aria-pressed={h.id === hotelId} onClick={() => setHotelId(h.id)}>{h.label}</button>
                ))}
              </div>
            </div>
          )}
          {pkgsForHotel.length > 1 && (
            <div>
              <div className="pb-label" id="lbl-pkg">Багц</div>
              <div className="choice-grid" role="group" aria-labelledby="lbl-pkg">
                {pkgsForHotel.map((o) => (
                  <button key={o.id} type="button" className="choice" aria-pressed={o.id === option?.id} onClick={() => setPkg(o.packageType)}>{PACKAGE[o.packageType]}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="pb-label" id="lbl-dep">Хуваарь</div>
            <div className="choice-grid" role="group" aria-labelledby="lbl-dep">
              {departures.map((d) => {
                const p = option ? d.prices[option.id] : null;
                const full = d.seatsLeft === 0;
                return (
                  <button key={d.id} type="button" className="choice" aria-pressed={d.id === depId} disabled={!p || full} onClick={() => setDepId(d.id)}>
                    <span>{range(d.startDate, d.endDate, { year: false })}</span>
                    <small>{full ? 'Дүүрсэн' : p ? money(p.adult) : 'Үнэ гараагүй'}</small>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="pb-label">Аялагчид</div>
            {[
              ['adults', 'Том хүн', '12-оос дээш', 1, price?.adult],
              ['children', 'Хүүхэд', '2–11 нас', 0, q?.childUnit ?? price?.child],
              ['infants', 'Нярай', '0–1.99 нас', 0, price?.infant],
            ].map(([k, label, sub, min, unit]) => (
              <div className="counter" key={k}>
                <div className="stack"><b style={{ textAlign: 'left', fontSize: 15 }}>{label}</b><small className="muted">{sub} · {unit ? money(unit) : '—'}</small></div>
                <div className="ctl">
                  <button type="button" onClick={() => step(k, -1, min)} disabled={pax[k] <= min} aria-label={`${label} хасах`}>−</button>
                  <b aria-live="polite">{pax[k]}</b>
                  <button type="button" onClick={() => step(k, 1, min)} disabled={pax[k] >= 9} aria-label={`${label} нэмэх`}>+</button>
                </div>
              </div>
            ))}
            {option?.singleSupplement > 0 && (
              <label className="check" style={{ marginTop: 14 }}>
                <input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} />
                Өрөөнд ганцаараа байрлах (+{money(option.singleSupplement)})
              </label>
            )}
          </div>

          {q?.childAsAdult && <div className="info-box">1 том хүн 1 хүүхэд тул хүүхдийг том хүний үнээр тооцлоо.</div>}
          {!seatsOk && <div className="error-box">Энэ хуваарьт {dep.seatsLeft} суудал үлдсэн байна.</div>}

          {q ? (
            <div className="sum">
              {q.lines.map((l) => <div className="line" key={l.key}><span>{l.label}</span><span>{money(l.amount)}</span></div>)}
              <div className="line total"><b style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink)' }}>Нийт</b><b>{money(q.total)}</b></div>
            </div>
          ) : (
            <div className="info-box">Энэ хуваарьт сонгосон буудлын үнэ одоогоор гараагүй байна.</div>
          )}

          <div className="stack gap-12">
            <Link href={href('online')} className="btn btn-accent btn-lg btn-block" aria-disabled={!q || !seatsOk}
              onClick={(e) => { if (!q || !seatsOk) e.preventDefault(); else track('InitiateCheckout', { value: q.total, currency: 'MNT' }); }}>Онлайн захиалах</Link>
            <Link href={href('request')} className="btn btn-outline-dark btn-lg btn-block" aria-disabled={!q || !seatsOk}
              onClick={(e) => { if (!q || !seatsOk) e.preventDefault(); else track('InitiateCheckout', { value: q.total, currency: 'MNT' }); }}>Хүсэлт илгээх</Link>
            <small className="muted" style={{ textAlign: 'center' }}>Хүсэлт илгээвэл бид тантай утсаар холбогдоно.</small>
          </div>
        </div>
      </aside>

      <div className="mobile-bar">
        <div className="stack">
          <small className="muted" style={{ fontWeight: 700 }}>Нийт</small>
          <b style={{ fontSize: 20 }}>{q ? money(q.total) : '—'}</b>
        </div>
        <a href="#price" className="btn btn-accent">Захиалах</a>
      </div>
    </>
  );
}
