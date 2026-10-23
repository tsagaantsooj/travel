'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { track } from '@/lib/site';

function months(n = 6) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) { out.push(`${d.getFullYear()} оны ${d.getMonth() + 1}-р сар`); d.setMonth(d.getMonth() + 1); }
  return out;
}

export default function CustomTripForm() {
  const [f, setF] = useState({ destination: '', travelWhen: 'Хамаагүй', groupSize: '1–4', phone: '', name: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!/^\d{8}$/.test(f.phone.replace(/\D/g, ''))) { setErr('Утасны дугаар 8 оронтой байх ёстой'); return; }
    setState('busy');
    try {
      await api('/leads', { method: 'POST', body: { ...f, phone: f.phone.replace(/\D/g, '') } });
      track('Lead', { content_name: 'custom_trip' });
      setState('done');
    } catch (e2) { setErr(e2.message); setState('idle'); }
  };

  return (
    <section className="section wrap" id="custom">
      <div className="custom">
        <div className="in">
          <div className="stack gap-16" style={{ flex: '1 1 380px' }}>
            <span className="eyebrow">Захиалгат аялал</span>
            <h2>Мөрөөдлийн аяллаа бидэнтэй хамт төлөвлө</h2>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: '#C9D5EA', maxWidth: 480 }}>Байгууллага, гэр бүл, найз нөхдийн аяллыг таны хугацаа, төсөвт тааруулж тусгайлан зохионо.</p>
          </div>
          <div className="card-form">
            {state === 'done' ? (
              <div className="stack gap-12 rise" style={{ alignItems: 'center', textAlign: 'center', padding: '28px 8px' }}>
                <span style={{ width: 64, height: 64, borderRadius: 999, background: '#E3F3EA', color: '#1F6B42', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }} aria-hidden="true">✓</span>
                <b style={{ fontSize: 22 }}>Хүсэлт хүлээн авлаа</b>
                <span className="muted" style={{ lineHeight: 1.6 }}>Манай менежер тантай удахгүй холбогдож хөтөлбөрийн санал илгээнэ.</span>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }} noValidate>
                <div className="field" style={{ gridColumn: '1 / -1' }}><label htmlFor="ct-dest">Хаашаа явмаар байна?</label><input id="ct-dest" className="input" placeholder="Жишээ нь: Япон, Бали" value={f.destination} onChange={set('destination')} /></div>
                <div className="field"><label htmlFor="ct-when">Хэзээ</label><select id="ct-when" className="select" value={f.travelWhen} onChange={set('travelWhen')}><option>Хамаагүй</option>{months().map((m) => <option key={m}>{m}</option>)}</select></div>
                <div className="field"><label htmlFor="ct-size">Хэдэн хүн</label><select id="ct-size" className="select" value={f.groupSize} onChange={set('groupSize')}><option>1–4</option><option>5–10</option><option>11–30</option><option>30-аас дээш</option></select></div>
                <div className="field"><label htmlFor="ct-name">Нэр</label><input id="ct-name" className="input" value={f.name} onChange={set('name')} autoComplete="name" /></div>
                <div className="field"><label htmlFor="ct-phone">Утасны дугаар</label><input id="ct-phone" className="input" inputMode="numeric" placeholder="9911 2233" value={f.phone} onChange={set('phone')} autoComplete="tel" /></div>
                {err && <div className="error-box" style={{ gridColumn: '1 / -1' }} role="alert">{err}</div>}
                <button type="submit" className="btn-sun" disabled={state === 'busy'} style={{ gridColumn: '1 / -1', justifyContent: 'center' }}>{state === 'busy' ? 'Илгээж байна…' : 'Санал авах'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
