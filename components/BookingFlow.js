'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from './AuthProvider';
import { track } from '@/lib/site';
import { money, range, hotelLabel, PACKAGE } from '@/lib/format';
import { IconCheck, IconChevronLeft, IconLock } from './Icons';

const STEPS = ['Холбоо барих', 'Аялагчид', 'Төлбөр'];
const AGE = { adult: 'Том хүн', child: 'Хүүхэд', infant: 'Нярай' };
const emptyTraveler = () => ({ lastName: '', firstName: '', birthDate: '', passportNo: '', passportExpiry: '' });

function Countdown({ until }) {
  const [left, setLeft] = useState(() => Math.max(0, new Date(until) - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(until) - Date.now())), 1000);
    return () => clearInterval(t);
  }, [until]);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return <>{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</>;
}

function Summary({ q, pax }) {
  return (
    <aside className="summary" aria-label="Захиалгын хураангуй">
      {q.coverImageUrl && <img src={q.coverImageUrl} alt="" />}
      <div className="inner">
        <div className="stack gap-4">
          <span className="muted" style={{ fontSize: 13, fontWeight: 800 }}>{q.country}</span>
          <span className="serif" style={{ fontWeight: 600, fontSize: 22 }}>{q.tourTitle}</span>
        </div>
        <dl className="dl">
          <dt>Хуваарь</dt><dd>{range(q.startDate, q.endDate)}</dd>
          {q.hotelName && <><dt>Буудал</dt><dd>{hotelLabel(q.hotelName, q.hotelStars)}</dd></>}
          <dt>Багц</dt><dd>{PACKAGE[q.packageType]}</dd>
          <dt>Аялагчид</dt><dd>{[pax.adults && `${pax.adults} том`, pax.children && `${pax.children} хүүхэд`, pax.infants && `${pax.infants} нярай`].filter(Boolean).join(', ')}</dd>
        </dl>
        <div className="sum" style={{ background: 'none', padding: 0 }}>
          {q.lines.map((l) => <div className="line" key={l.key}><span>{l.label}{l.qty > 1 ? ` × ${l.qty}` : ''}</span><span>{money(l.amount)}</span></div>)}
          <div className="line total"><b style={{ fontFamily: 'var(--sans)', fontSize: 16, color: 'var(--ink)' }}>Нийт</b><b>{money(q.total)}</b></div>
        </div>
      </div>
    </aside>
  );
}

function PaymentView({ code, onPaid }) {
  const [inv, setInv] = useState(null);
  const [err, setErr] = useState('');
  const [checking, setChecking] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    api(`/bookings/${code}/pay`, { method: 'POST' })
      .then(({ data }) => setInv(data))
      .catch((e) => setErr(e.message));
  }, [code]);

  const check = useCallback(async (manual = false) => {
    if (manual) setChecking(true);
    try {
      const { data } = await api(`/bookings/${code}/check`, { method: 'POST' });
      if (data.paid) onPaid();
      else if (manual) setErr('Төлбөр хараахан орж ирээгүй байна. Төлсний дараа хэдэн секунд хүлээгээд дахин шалгана уу.');
    } catch (e) { if (manual) setErr(e.message); }
    finally { if (manual) setChecking(false); }
  }, [code, onPaid]);

  useEffect(() => {
    if (!inv) return undefined;
    const t = setInterval(() => check(false), 5000);
    return () => clearInterval(t);
  }, [inv, check]);

  const mockPay = async () => {
    try { await api(`/bookings/${code}/mock-pay`, { method: 'POST' }); onPaid(); } catch (e) { setErr(e.message); }
  };

  if (err && !inv) return <div className="panel"><div className="error-box">{err}</div><Link href="/account/bookings" className="btn btn-outline">Миний захиалгууд</Link></div>;
  if (!inv) return <div className="panel"><div className="row gap-12"><span className="spinner" />Нэхэмжлэх үүсгэж байна…</div></div>;

  return (
    <section className="panel" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 28 }}>
      <div className="stack gap-12" style={{ flex: '0 0 240px', alignItems: 'center' }}>
        <div className="qr">
          {inv.qrImage ? <img src={`data:image/png;base64,${inv.qrImage}`} alt="QPay QR код" width={240} height={240} />
            : <span className="muted" style={{ padding: 20, textAlign: 'center', fontWeight: 700 }}>Тест горим: QR код гарахгүй</span>}
        </div>
        <span className="muted" style={{ fontSize: 13, fontWeight: 600, textAlign: 'center' }}>Банкны аппаараа QR уншуулна уу</span>
      </div>
      <div className="stack gap-16" style={{ flex: '1 1 320px' }}>
        <div className="stack gap-4">
          <span className="muted" style={{ fontSize: 13, fontWeight: 800 }}>Төлөх дүн</span>
          <span className="serif" style={{ fontWeight: 700, fontSize: 36, color: 'var(--teal)' }}>{money(inv.amount)}</span>
          <span className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Захиалга: {inv.code}</span>
        </div>
        {inv.expiresAt && <div className="info-box">Таны суудал <b><Countdown until={inv.expiresAt} /></b> минут түгжигдсэн байна.</div>}
        {inv.urls?.length > 0 && (
          <div className="stack gap-8">
            <span className="label">Утаснаас банкны апп нээх</span>
            <div className="bank-grid">
              {inv.urls.map((u) => (
                <a key={u.name} href={u.link}>{u.logo && <img src={u.logo} alt="" />}{u.description || u.name}</a>
              ))}
            </div>
          </div>
        )}
        {err && <div className="error-box">{err}</div>}
        <button type="button" className="btn btn-primary btn-lg" onClick={() => check(true)} disabled={checking}>
          {checking ? 'Шалгаж байна…' : 'Төлбөр шалгах'}
        </button>
        {inv.mock && (
          <button type="button" className="btn btn-outline" onClick={mockPay}>Төлсөн гэж тэмдэглэх (тест горим)</button>
        )}
        <span className="muted" style={{ fontSize: 13 }}>Төлбөр орсны дараа энэ хуудас автоматаар шинэчлэгдэнэ.</span>
      </div>
    </section>
  );
}

function Done({ type, code }) {
  const req = type === 'request';
  return (
    <section className="panel done-card">
      <span className="done-icon" style={{ background: req ? '#2D5FA0' : '#1F7A4A' }}><IconCheck size={38} strokeWidth={2.6} /></span>
      <h1 className="serif" style={{ fontWeight: 600, fontSize: 34 }}>{req ? 'Хүсэлт хүлээн авлаа' : 'Төлбөр амжилттай'}</h1>
      <p className="muted" style={{ maxWidth: 520, lineHeight: 1.6 }}>
        {req ? 'Оператор тантай удахгүй утсаар холбогдож суудал, төлбөрийн нөхцөлийг баталгаажуулна.'
          : 'Таны захиалга баталгаажлаа. Аяллын заавар, цуглах цагийг аялал эхлэхээс өмнө илгээнэ.'}
      </p>
      <div className="info-box" style={{ background: 'var(--bg-soft)', color: 'var(--ink)' }}>Захиалгын код: <b>{code}</b></div>
      <div className="row gap-12" style={{ justifyContent: 'center' }}>
        <Link href="/account/bookings" className="btn btn-primary btn-lg">Миний захиалгууд</Link>
        <Link href="/" className="btn btn-outline btn-lg">Нүүр хуудас</Link>
      </div>
    </section>
  );
}

export default function BookingFlow() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const payCode = sp.get('pay');
  const input = useMemo(() => ({
    departureId: Number(sp.get('d')), optionId: Number(sp.get('o')),
    adults: Math.max(1, Number(sp.get('a') || 1)), children: Math.max(0, Number(sp.get('c') || 0)),
    infants: Math.max(0, Number(sp.get('i') || 0)), singleRoom: sp.get('s') === '1',
  }), [sp]);

  const [q, setQ] = useState(null);
  const [loadErr, setLoadErr] = useState('');
  const [step, setStep] = useState(payCode ? 'pay' : 1);
  const [method, setMethod] = useState(sp.get('t') === 'request' ? 'request' : 'online');
  const [agree, setAgree] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', note: '' });
  const [travelers, setTravelers] = useState([]);
  const [skipTravelers, setSkipTravelers] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState(payCode || '');
  const [doneType, setDoneType] = useState('paid');

  useEffect(() => {
    if (payCode) return;
    if (!input.departureId || !input.optionId) { setLoadErr('Аялал, хуваариа сонгоод дахин оролдоно уу.'); return; }
    api('/bookings/quote', { method: 'POST', body: input })
      .then(({ data }) => setQ(data))
      .catch((e) => setLoadErr(e.message));
  }, [input, payCode]);

  useEffect(() => {
    if (user) setContact((c) => ({ ...c, name: c.name || user.fullName || '', phone: c.phone || user.phone || '', email: c.email || user.email || '' }));
  }, [user]);

  const slots = useMemo(() => [
    ...Array(input.adults).fill('adult'), ...Array(input.children).fill('child'), ...Array(input.infants).fill('infant'),
  ], [input]);
  useEffect(() => { setTravelers(slots.map(() => emptyTraveler())); }, [slots]);

  const setT = (i, k, v) => setTravelers((ts) => ts.map((t, j) => (j === i ? { ...t, [k]: v } : t)));

  const validateStep = () => {
    setErr('');
    if (step === 1) {
      if (contact.name.trim().length < 2) return 'Овог нэрээ оруулна уу';
      if (!/^\d{8}$/.test(contact.phone.replace(/\D/g, ''))) return 'Утасны дугаар 8 оронтой байх ёстой';
    }
    if (step === 2 && !(method === 'request' && skipTravelers)) {
      for (let i = 0; i < travelers.length; i++) {
        const t = travelers[i];
        if (!t.lastName || !t.firstName || !t.birthDate) return `${i + 1}-р аялагчийн овог, нэр, төрсөн огноог бөглөнө үү`;
        if (!/^[A-Za-z\s'-]+$/.test(t.lastName + t.firstName)) return `${i + 1}-р аялагчийн нэрийг латин үсгээр бичнэ үү`;
      }
    }
    return '';
  };

  const next = () => {
    const e = validateStep();
    if (e) { setErr(e); return; }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setErr('');
    if (method === 'online' && !user) { setErr('Онлайн төлөхийн тулд нэвтэрнэ үү'); return; }
    setBusy(true);
    try {
      const sendTravelers = method === 'online' || !skipTravelers
        ? travelers.map((t) => ({ ...t, passportExpiry: t.passportExpiry || '', passportNo: t.passportNo || '' }))
        : [];
      const { data } = await api('/bookings', {
        method: 'POST',
        body: { ...input, bookingType: method, contact: { ...contact, phone: contact.phone.replace(/\D/g, '') }, travelers: sendTravelers },
      });
      setCode(data.code);
      if (method === 'online') setStep('pay');
      else { track('Lead', { value: q?.total || 0, currency: 'MNT' }); setDoneType('request'); setStep('done'); }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const loginHref = `/login?next=${encodeURIComponent(`${pathname}?${sp.toString()}`)}`;

  if (step === 'done') return <div className="page soft-page"><div className="container"><Done type={doneType} code={code} /></div></div>;

  if (step === 'pay') {
    return (
      <div className="page soft-page">
        <div className="container stack gap-24">
          <h1 className="title-xl" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>Төлбөр төлөх</h1>
          {authLoading ? <div className="spinner" /> : !user ? (
            <div className="panel"><p>Төлбөр төлөхийн тулд нэвтэрнэ үү.</p><Link href={loginHref} className="btn btn-primary">Нэвтрэх</Link></div>
          ) : (
            <PaymentView code={code} onPaid={() => { track('Purchase', { value: q?.total || 0, currency: 'MNT' }); setDoneType('paid'); setStep('done'); }} />
          )}
        </div>
      </div>
    );
  }

  if (loadErr) {
    return (
      <div className="page soft-page"><div className="container stack gap-16">
        <div className="error-box">{loadErr}</div>
        <Link href="/tours" className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Аяллууд руу буцах</Link>
      </div></div>
    );
  }
  if (!q) return <div className="page soft-page"><div className="container"><div className="spinner" /></div></div>;

  return (
    <div className="page soft-page">
      <div className="container stack gap-24">
        <div className="stack gap-16">
          <Link href={`/tours/${q.tourSlug}`} className="row gap-4 muted" style={{ fontWeight: 700, textDecoration: 'none', alignSelf: 'flex-start' }}>
            <IconChevronLeft size={16} /> Аялал руу буцах
          </Link>
          <h1 className="title-xl" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>Захиалга баталгаажуулах</h1>
          <ol className="steps" aria-label="Алхмууд">
            {STEPS.map((s, i) => {
              const n = i + 1;
              const cls = n < step ? 'done' : n === step ? 'current' : '';
              return <li key={s} className={cls} aria-current={n === step ? 'step' : undefined}><span className="n">{n < step ? '✓' : n}</span><b>{s}</b></li>;
            })}
          </ol>
        </div>

        <div className="detail-layout" style={{ gap: 32 }}>
          <div className="stack gap-20" style={{ flex: '999 1 560px', minWidth: 0 }}>
            {step === 1 && (
              <section className="panel">
                <div className="stack gap-4">
                  <h2>Холбоо барих мэдээлэл</h2>
                  <p className="muted">Захиалгын мэдэгдэл энэ дугаарт очно.</p>
                </div>
                {method === 'online' && !user && !authLoading && (
                  <div className="info-box row between gap-12">
                    <span>Онлайн төлөхийн тулд эхлээд нэвтэрнэ үү. Хүсэлт илгээх бол нэвтрэх шаардлагагүй.</span>
                    <Link href={loginHref} className="btn btn-primary btn-sm">Нэвтрэх</Link>
                  </div>
                )}
                <div className="form-grid">
                  <div className="field"><label htmlFor="c-name">Овог нэр</label><input id="c-name" className="input" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} autoComplete="name" /></div>
                  <div className="field"><label htmlFor="c-phone">Утасны дугаар</label><input id="c-phone" className="input" inputMode="numeric" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} autoComplete="tel" /></div>
                  <div className="field"><label htmlFor="c-mail">И-мэйл (заавал биш)</label><input id="c-mail" type="email" className="input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} autoComplete="email" /></div>
                </div>
                <div className="field"><label htmlFor="c-note">Нэмэлт хүсэлт (заавал биш)</label><input id="c-note" className="input" placeholder="Жишээ нь: хоёр тусдаа ор" value={contact.note} onChange={(e) => setContact({ ...contact, note: e.target.value })} /></div>
                {err && <div className="error-box">{err}</div>}
                <div className="row" style={{ justifyContent: 'flex-end' }}><button type="button" className="btn btn-primary btn-lg" onClick={next}>Үргэлжлүүлэх</button></div>
              </section>
            )}

            {step === 2 && (
              <section className="stack gap-16">
                <div className="info-box">Нэрийг паспортынхтай яг адил латин үсгээр бичнэ үү. Насны ангиллыг төрсөн огноо ба аялал эхлэх өдрөөр шалгана.</div>
                {method === 'request' && (
                  <label className="check panel" style={{ padding: 18 }}>
                    <input type="checkbox" checked={skipTravelers} onChange={(e) => setSkipTravelers(e.target.checked)} />
                    Аялагчдын мэдээллийг дараа нь оператортой хамт бөглөнө
                  </label>
                )}
                {!(method === 'request' && skipTravelers) && travelers.map((t, i) => (
                  <div className="panel" key={i}>
                    <div className="row gap-12">
                      <span className="avatar" style={{ width: 36, height: 36 }}>{i + 1}</span>
                      <h2 style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 800 }}>{AGE[slots[i]]} {slots.slice(0, i + 1).filter((x) => x === slots[i]).length}</h2>
                    </div>
                    <div className="form-grid">
                      <div className="field"><label htmlFor={`t${i}l`}>Овог (латинаар)</label><input id={`t${i}l`} className="input" style={{ textTransform: 'uppercase' }} value={t.lastName} onChange={(e) => setT(i, 'lastName', e.target.value)} /></div>
                      <div className="field"><label htmlFor={`t${i}f`}>Нэр (латинаар)</label><input id={`t${i}f`} className="input" style={{ textTransform: 'uppercase' }} value={t.firstName} onChange={(e) => setT(i, 'firstName', e.target.value)} /></div>
                      <div className="field"><label htmlFor={`t${i}b`}>Төрсөн огноо</label><input id={`t${i}b`} type="date" className="input" value={t.birthDate} onChange={(e) => setT(i, 'birthDate', e.target.value)} /></div>
                      <div className="field"><label htmlFor={`t${i}p`}>Паспортын дугаар</label><input id={`t${i}p`} className="input" value={t.passportNo} onChange={(e) => setT(i, 'passportNo', e.target.value)} /></div>
                      <div className="field"><label htmlFor={`t${i}e`}>Паспорт дуусах огноо</label><input id={`t${i}e`} type="date" className="input" value={t.passportExpiry} onChange={(e) => setT(i, 'passportExpiry', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                {err && <div className="error-box">{err}</div>}
                <div className="row between gap-12">
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => { setErr(''); setStep(1); }}>Буцах</button>
                  <button type="button" className="btn btn-primary btn-lg" onClick={next}>Үргэлжлүүлэх</button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="panel">
                <h2>Хэрхэн захиалах вэ?</h2>
                <div role="radiogroup" aria-label="Захиалгын хэлбэр" className="form-grid">
                  <button type="button" role="radio" aria-checked={method === 'online'} className="radio-card" onClick={() => setMethod('online')}>
                    <b>QPay-ээр онлайн төлөх</b><span>Суудал тань шууд түгжигдэж, төлбөр орсон даруйд захиалга баталгаажна.</span>
                  </button>
                  <button type="button" role="radio" aria-checked={method === 'request'} className="radio-card" onClick={() => setMethod('request')}>
                    <b>Хүсэлт илгээх</b><span>Одоо төлөхгүй. Оператор тантай утсаар холбогдож нөхцөлөө тохирно.</span>
                  </button>
                </div>
                {method === 'online' && !user && !authLoading && (
                  <div className="info-box row between gap-12">
                    <span className="row gap-8"><IconLock /> Онлайн төлөхийн тулд нэвтэрнэ үү.</span>
                    <Link href={loginHref} className="btn btn-primary btn-sm">Нэвтрэх</Link>
                  </div>
                )}
                {method === 'online' && travelers.some((t) => !t.lastName) && (
                  <div className="error-box">Онлайн төлбөрт бүх аялагчийн мэдээлэл шаардлагатай. <button type="button" className="btn-link" onClick={() => { setSkipTravelers(false); setStep(2); }}>Бөглөх</button></div>
                )}
                <label className="check">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span><Link href="/terms" target="_blank">Аяллын нөхцөл, цуцлалтын журам</Link>-тай танилцаж зөвшөөрч байна</span>
                </label>
                {err && <div className="error-box">{err}</div>}
                <div className="row between gap-12">
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => { setErr(''); setStep(2); }}>Буцах</button>
                  <button type="button" className="btn btn-accent btn-lg" onClick={submit}
                    disabled={!agree || busy || (method === 'online' && (!user || travelers.some((t) => !t.lastName)))}>
                    {busy ? 'Илгээж байна…' : method === 'online' ? 'Төлбөр төлөх' : 'Хүсэлт илгээх'}
                  </button>
                </div>
              </section>
            )}
          </div>
          <Summary q={q} pax={input} />
        </div>
      </div>
    </div>
  );
}
