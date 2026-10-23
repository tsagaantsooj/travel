'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { money, range, hotelLabel, PACKAGE, STATUS, PROVIDER, dateTime } from '@/lib/format';
import { IconImage } from '@/components/Icons';

const today = new Date().toISOString().slice(0, 10);
const isPast = (b) => ['cancelled', 'expired'].includes(b.status) || b.endDate < today;

function canPay(b) {
  if (b.totalAmount - b.paidAmount <= 0) return false;
  if (b.status === 'confirmed') return true;
  return b.status === 'awaiting_payment' && b.expiresAt && new Date(b.expiresAt) > new Date();
}

function BookingCard({ b }) {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(null);
  const st = STATUS[b.status];

  const toggle = async () => {
    setOpen((o) => !o);
    if (!full) { try { setFull((await api(`/bookings/${b.code}`)).data); } catch { /* ignore */ } }
  };

  const pax = [b.adults && `${b.adults} том хүн`, b.children && `${b.children} хүүхэд`, b.infants && `${b.infants} нярай`].filter(Boolean).join(', ');

  return (
    <article className="booking-card">
      <div className="top">
        <div className="thumb">{b.tour.coverImageUrl ? <img src={b.tour.coverImageUrl} alt="" /> : <span className="placeholder-media" style={{ position: 'static', height: '100%' }}><IconImage size={28} /></span>}</div>
        <div className="stack gap-8" style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div className="row gap-12"><span className={`badge tone-${st.tone}`}>{st.label}</span><span className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{b.code}</span></div>
          <h2 className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{b.tour.title}</h2>
          <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>
            {range(b.startDate, b.endDate)}{b.hotelName ? `, ${hotelLabel(b.hotelName, b.hotelStars)}` : ''}, {PACKAGE[b.packageType]}, {pax}
          </span>
        </div>
        <div className="stack gap-8" style={{ alignItems: 'flex-end' }}>
          <div className="stack" style={{ alignItems: 'flex-end' }}>
            <span className="serif" style={{ fontWeight: 700, fontSize: 24 }}>{money(b.totalAmount)}</span>
            <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
              {b.paidAmount >= b.totalAmount ? 'Бүрэн төлөгдсөн' : b.paidAmount > 0 ? `${money(b.paidAmount)} төлсөн` : 'Төлөөгүй'}
            </span>
          </div>
          <div className="row gap-8">
            {canPay(b) && <Link href={`/booking?pay=${b.code}`} className="btn btn-accent btn-sm">Төлөх</Link>}
            <button type="button" className="btn btn-outline btn-sm" onClick={toggle} aria-expanded={open}>{open ? 'Хураах' : 'Дэлгэрэнгүй'}</button>
          </div>
        </div>
      </div>
      {b.status === 'awaiting_payment' && canPay(b) && <div className="info-box" style={{ margin: '0 20px 20px' }}>Суудал {dateTime(b.expiresAt)} хүртэл түгжигдсэн. Хугацаандаа төлнө үү.</div>}
      {b.status === 'pending' && <div className="info-box" style={{ margin: '0 20px 20px', background: '#E3ECF8', color: '#2A5794' }}>Оператор тантай удахгүй холбогдоно.</div>}
      {open && (
        <div className="more">
          {!full ? <div className="spinner" /> : (
            <>
              <div className="stack gap-8">
                <span className="label muted">Аялагчид</span>
                {full.travelers.length ? full.travelers.map((t, i) => (
                  <div key={i} className="row between" style={{ fontSize: 14, fontWeight: 600 }}><span>{t.lastName} {t.firstName}</span><span className="muted">{t.ageLabel}</span></div>
                )) : <span className="muted" style={{ fontSize: 14 }}>Оператортой хамт бөглөнө</span>}
              </div>
              <div className="stack gap-8">
                <span className="label muted">Төлбөрийн түүх</span>
                {full.payments.filter((p) => p.status === 'paid').length ? full.payments.filter((p) => p.status === 'paid').map((p) => (
                  <div key={p.id} className="row between" style={{ fontSize: 14, fontWeight: 600 }}><span>{dateTime(p.paidAt)}, {PROVIDER[p.provider]}</span><span>{money(p.amount)}</span></div>
                )) : <span className="muted" style={{ fontSize: 14 }}>Төлбөр хийгдээгүй</span>}
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default function MyBookingsPage() {
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('active');

  useEffect(() => { api('/bookings/my').then(({ data }) => setItems(data)).catch((e) => setErr(e.message)); }, []);

  const list = (items || []).filter((b) => (tab === 'past' ? isPast(b) : !isPast(b)));

  return (
    <div className="page soft-page">
      <div className="container stack gap-24" style={{ maxWidth: 1040 }}>
        <div className="row between gap-16" style={{ alignItems: 'flex-end' }}>
          <h1 className="title-xl" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>Миний захиалгууд</h1>
          <div className="segmented" role="group" aria-label="Шүүлтүүр">
            <button type="button" aria-pressed={tab === 'active'} onClick={() => setTab('active')}>Идэвхтэй</button>
            <button type="button" aria-pressed={tab === 'past'} onClick={() => setTab('past')}>Өнгөрсөн</button>
          </div>
        </div>
        {err && <div className="error-box">{err}</div>}
        {!items && !err && <div className="spinner" />}
        {items && (list.length ? list.map((b) => <BookingCard key={b.code} b={b} />) : (
          <div className="empty" style={{ background: '#fff' }}>
            {tab === 'active' ? 'Идэвхтэй захиалга алга.' : 'Өнгөрсөн захиалга алга.'}
            {tab === 'active' && <Link href="/tours" className="btn btn-primary">Аялал сонгох</Link>}
          </div>
        ))}
      </div>
    </div>
  );
}
