'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';
import { money, range, hotelLabel, PACKAGE, ADMIN_STATUS, PROVIDER, dateTime } from '@/lib/format';

const FILTERS = ['', 'pending', 'awaiting_payment', 'confirmed', 'paid', 'cancelled', 'expired'];

function Detail({ code, onChanged, toast }) {
  const [b, setB] = useState(null);
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState('transfer');
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setB(null);
    api(`/admin/bookings/${code}`).then(({ data }) => { setB(data); setAmount(String(data.totalAmount - data.paidAmount)); }).catch((e) => toast(e.message, true));
  }, [code, toast]);

  const act = async (path, body, okMsg) => {
    setBusy(true);
    try {
      const { data, message } = await api(`/admin/bookings/${code}/${path}`, { method: 'POST', body });
      setB(data); setAmount(String(data.totalAmount - data.paidAmount)); setNote(''); setReason('');
      toast(okMsg || message); onChanged();
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  if (!b) return <aside className="side-panel"><div className="spinner" /></aside>;
  const st = ADMIN_STATUS[b.status];
  const remaining = b.totalAmount - b.paidAmount;
  const locked = ['cancelled'].includes(b.status);

  return (
    <aside className="side-panel" aria-label="Захиалгын дэлгэрэнгүй">
      <div className="row between gap-12" style={{ alignItems: 'flex-start' }}>
        <div className="stack gap-4"><span className="muted" style={{ fontWeight: 800, fontSize: 13 }}>{b.code}</span><span className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{b.tour.title}</span></div>
        <span className={`badge tone-${st.tone}`}>{st.label}</span>
      </div>
      <dl className="dl">
        <dt>Захиалагч</dt><dd>{b.contact.name}</dd>
        <dt>Утас</dt><dd><a href={`tel:${b.contact.phone}`}>{b.contact.phone}</a></dd>
        {b.contact.email && <><dt>И-мэйл</dt><dd>{b.contact.email}</dd></>}
        <dt>Хуваарь</dt><dd>{range(b.startDate, b.endDate)}</dd>
        <dt>Сонголт</dt><dd>{[hotelLabel(b.hotelName, b.hotelStars), PACKAGE[b.packageType]].filter(Boolean).join(', ')}</dd>
        <dt>Аялагчид</dt><dd>{b.adults} том, {b.children} хүүхэд, {b.infants} нярай{b.singleRoom ? ', ганцаараа өрөө' : ''}</dd>
        <dt>Хэлбэр</dt><dd>{b.bookingType === 'online' ? 'Онлайн' : 'Хүсэлт'}</dd>
        <dt>Нийт</dt><dd>{money(b.totalAmount)}</dd>
        <dt>Төлсөн</dt><dd style={{ color: '#1F6B42' }}>{money(b.paidAmount)}</dd>
        <dt>Үүссэн</dt><dd>{dateTime(b.createdAt)}</dd>
      </dl>
      {b.contact.note && <div className="info-box">Тэмдэглэл: {b.contact.note}</div>}
      {b.cancelReason && <div className="info-box">Цуцалсан шалтгаан: {b.cancelReason}</div>}

      <div className="stack gap-8">
        <span className="label muted">Аялагчид</span>
        {b.travelers.length ? b.travelers.map((t, i) => (
          <div key={i} style={{ fontSize: 14 }}><b>{t.lastName} {t.firstName}</b> <span className="muted">({t.ageLabel}, {t.birthDate})</span><br />
            <span className="muted">Паспорт: {t.passportNo || '—'}{t.passportExpiry ? `, дуусах ${t.passportExpiry}` : ''}</span></div>
        )) : <span className="muted" style={{ fontSize: 14 }}>Бөглөөгүй</span>}
      </div>

      {b.payments.length > 0 && (
        <div className="stack gap-8">
          <span className="label muted">Төлбөр</span>
          {b.payments.map((p) => (
            <div key={p.id} className="row between" style={{ fontSize: 14 }}>
              <span>{PROVIDER[p.provider]}, {p.status === 'paid' ? dateTime(p.paidAt) : p.status}</span><b>{money(p.amount)}</b>
            </div>
          ))}
        </div>
      )}

      {!locked && (
        <div className="stack gap-12" style={{ borderTop: '1px solid var(--mist)', paddingTop: 16 }}>
          {b.status === 'pending' && (
            <button type="button" className="btn btn-outline" disabled={busy} onClick={() => act('confirm', {}, 'Баталгаажууллаа')}>Баталгаажуулах</button>
          )}
          {remaining > 0 && (
            <>
              <span className="label muted">Гараар төлбөр бүртгэх</span>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="field"><label htmlFor="p-amt">Дүн</label><input id="p-amt" className="input input-sm" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} /></div>
                <div className="field"><label htmlFor="p-prov">Хэлбэр</label>
                  <select id="p-prov" className="select input-sm" value={provider} onChange={(e) => setProvider(e.target.value)}>
                    <option value="transfer">Шилжүүлэг</option><option value="cash">Бэлэн</option><option value="card">Карт</option>
                  </select></div>
              </div>
              <input className="input input-sm" placeholder="Тэмдэглэл (заавал биш)" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Төлбөрийн тэмдэглэл" />
              <button type="button" className="btn btn-primary" disabled={busy || !Number(amount)} onClick={() => act('payments', { amount: Number(amount), provider, note }, 'Төлбөр бүртгэлээ')}>Төлбөр бүртгэх</button>
            </>
          )}
          <input className="input input-sm" placeholder="Цуцлах шалтгаан" value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Цуцлах шалтгаан" />
          <button type="button" className="btn btn-danger" disabled={busy}
            onClick={() => { if (window.confirm(`${b.code} захиалгыг цуцлах уу?`)) act('cancel', { reason }, 'Цуцаллаа'); }}>Захиалга цуцлах</button>
        </div>
      )}
    </aside>
  );
}

export default function AdminBookingsPage() {
  const [toast, toastNode] = useToast();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [sel, setSel] = useState(null);

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (status) p.set('status', status);
    if (q.trim()) p.set('q', q.trim());
    try {
      const [{ data: list }, { data: s }] = await Promise.all([api(`/admin/bookings?${p}`), api('/admin/stats')]);
      setData(list); setStats(s);
    } catch (e) { toast(e.message, true); }
  }, [status, q, toast]);

  useEffect(() => { const t = setTimeout(load, q ? 300 : 0); return () => clearTimeout(t); }, [load, q]);

  const by = stats?.byStatus || {};
  return (
    <>
      <div className="row between gap-16">
        <h1>Захиалгууд</h1>
        <input className="input input-sm" style={{ width: 280 }} placeholder="Код, нэр, утсаар хайх" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Хайх" />
      </div>
      <div className="kpis">
        <div className="kpi"><small>Шинэ хүсэлт</small><b style={{ color: '#2A5794' }}>{by.pending || 0}</b></div>
        <div className="kpi"><small>Төлбөр хүлээгдэж буй</small><b style={{ color: '#97380F' }}>{by.awaiting_payment || 0}</b></div>
        <div className="kpi"><small>Нийт захиалга</small><b>{stats?.total || 0}</b></div>
        <div className="kpi"><small>Орсон төлбөр</small><b style={{ color: '#1F6B42' }}>{money(stats?.paidTotal || 0)}</b></div>
      </div>
      <div className="row gap-8" role="group" aria-label="Төлвөөр шүүх">
        {FILTERS.map((f) => (
          <button key={f || 'all'} type="button" className="filter-pill" aria-pressed={status === f} onClick={() => setStatus(f)}>
            {f ? ADMIN_STATUS[f].label : 'Бүгд'} · {f ? (by[f] || 0) : (stats?.total || 0)}
          </button>
        ))}
      </div>
      <div className="row gap-20" style={{ alignItems: 'flex-start' }}>
        <div className="table-wrap" style={{ flex: '999 1 560px', minWidth: 0 }}>
          <table className="table">
            <thead><tr><th>Код</th><th>Аялал</th><th>Захиалагч</th><th style={{ textAlign: 'right' }}>Дүн</th><th>Төлөв</th></tr></thead>
            <tbody>
              {!data && <tr><td colSpan={5}><div className="spinner" /></td></tr>}
              {data?.items.length === 0 && <tr><td colSpan={5} className="muted">Захиалга олдсонгүй</td></tr>}
              {data?.items.map((b) => (
                <tr key={b.code} className={`clickable${sel === b.code ? ' selected' : ''}`} onClick={() => setSel(b.code)}
                  tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSel(b.code); }}>
                  <td><b>{b.code}</b></td>
                  <td><div className="stack"><b>{b.tour.title}</b><span className="muted" style={{ fontSize: 13 }}>{range(b.startDate, b.endDate)}</span></div></td>
                  <td><div className="stack"><b>{b.contact.name}</b><span className="muted" style={{ fontSize: 13 }}>{b.contact.phone}, {b.bookingType === 'online' ? 'онлайн' : 'хүсэлт'}</span></div></td>
                  <td style={{ textAlign: 'right' }}><b>{money(b.totalAmount)}</b></td>
                  <td><span className={`badge tone-${ADMIN_STATUS[b.status].tone}`}>{ADMIN_STATUS[b.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel && <Detail code={sel} onChanged={load} toast={toast} />}
      </div>
      {toastNode}
    </>
  );
}
