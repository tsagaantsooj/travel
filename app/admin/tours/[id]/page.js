'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';
import { CATEGORY, PACKAGE, range, hotelLabel, money } from '@/lib/format';

const TABS = [['general', 'Ерөнхий'], ['days', 'Хөтөлбөр'], ['incl', 'Багтсан зүйлс'], ['options', 'Буудал, багц'], ['prices', 'Хуваарь ба үнэ'], ['images', 'Зураг']];

/* ---------------- Ерөнхий ---------------- */
function GeneralTab({ data, save }) {
  const t = data.tour;
  const [f, setF] = useState({ title: t.title, slug: t.slug, category: t.category, country: t.country, days: t.days, nights: t.nights, summary: t.summary || '', badge: t.badge || '', isFeatured: t.isFeatured, status: t.status, sortOrder: t.sortOrder });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <form className="card" onSubmit={(e) => { e.preventDefault(); save('', 'PUT', { ...f, days: Number(f.days), nights: Number(f.nights), sortOrder: Number(f.sortOrder) }); }}>
      <div className="form-grid">
        <div className="field"><label htmlFor="g1">Нэр</label><input id="g1" className="input" value={f.title} onChange={set('title')} /></div>
        <div className="field"><label htmlFor="g2">URL (slug)</label><input id="g2" className="input" value={f.slug} onChange={set('slug')} /></div>
        <div className="field"><label htmlFor="g3">Ангилал</label><select id="g3" className="select" value={f.category} onChange={set('category')}>{Object.entries(CATEGORY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div className="field"><label htmlFor="g4">Улс</label><input id="g4" className="input" value={f.country} onChange={set('country')} /></div>
        <div className="field"><label htmlFor="g5">Өдөр</label><input id="g5" type="number" className="input" value={f.days} onChange={set('days')} /></div>
        <div className="field"><label htmlFor="g6">Шөнө</label><input id="g6" type="number" className="input" value={f.nights} onChange={set('nights')} /></div>
        <div className="field"><label htmlFor="g7">Тэмдэглэгээ (картан дээр)</label><input id="g7" className="input" placeholder="Шууд нислэг" value={f.badge} onChange={set('badge')} /></div>
        <div className="field"><label htmlFor="g8">Төлөв</label><select id="g8" className="select" value={f.status} onChange={set('status')}><option value="draft">Ноорог</option><option value="published">Нийтлэгдсэн</option><option value="archived">Архивласан</option></select></div>
        <div className="field"><label htmlFor="g9">Эрэмбэ (их нь эхэнд)</label><input id="g9" type="number" className="input" value={f.sortOrder} onChange={set('sortOrder')} /></div>
      </div>
      <div className="field"><label htmlFor="g10">Товч тайлбар</label><textarea id="g10" className="textarea" value={f.summary} onChange={set('summary')} maxLength={500} /></div>
      <label className="check"><input type="checkbox" checked={f.isFeatured} onChange={set('isFeatured')} />Нүүр хуудсанд онцлох</label>
      <div><button type="submit" className="btn btn-primary">Хадгалах</button></div>
    </form>
  );
}

/* ---------------- Хөтөлбөр ---------------- */
function DaysTab({ data, save }) {
  const [days, setDays] = useState(data.days.map(({ title, description, hasBreakfast, hasLunch, hasDinner, hotelText, isFreeDay }) => ({ title, description: description || '', hasBreakfast, hasLunch, hasDinner, hotelText: hotelText || '', isFreeDay })));
  const upd = (i, k, v) => setDays((ds) => ds.map((d, j) => (j === i ? { ...d, [k]: v } : d)));
  const move = (i, dir) => setDays((ds) => { const a = [...ds]; const j = i + dir; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });
  return (
    <div className="stack gap-16">
      {days.map((d, i) => (
        <div className="card" key={i}>
          <div className="row between gap-12">
            <b>Өдөр {i + 1}</b>
            <div className="row gap-8">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Дээш">↑</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => move(i, 1)} disabled={i === days.length - 1} aria-label="Доош">↓</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setDays(days.filter((_, j) => j !== i))}>Устгах</button>
            </div>
          </div>
          <div className="form-grid">
            <div className="field"><label htmlFor={`d${i}t`}>Гарчиг</label><input id={`d${i}t`} className="input" value={d.title} onChange={(e) => upd(i, 'title', e.target.value)} /></div>
            <div className="field"><label htmlFor={`d${i}h`}>Буудал</label><input id={`d${i}h`} className="input" value={d.hotelText} onChange={(e) => upd(i, 'hotelText', e.target.value)} /></div>
          </div>
          <div className="field"><label htmlFor={`d${i}d`}>Тайлбар</label><textarea id={`d${i}d`} className="textarea" value={d.description} onChange={(e) => upd(i, 'description', e.target.value)} /></div>
          <div className="row gap-20">
            {[['hasBreakfast', 'Өглөөний цай'], ['hasLunch', 'Өдрийн хоол'], ['hasDinner', 'Оройн хоол'], ['isFreeDay', 'Чөлөөт өдөр']].map(([k, l]) => (
              <label className="check" key={k}><input type="checkbox" checked={d[k]} onChange={(e) => upd(i, k, e.target.checked)} />{l}</label>
            ))}
          </div>
        </div>
      ))}
      <div className="row gap-12">
        <button type="button" className="btn btn-outline" onClick={() => setDays([...days, { title: '', description: '', hasBreakfast: true, hasLunch: false, hasDinner: false, hotelText: days.at(-1)?.hotelText || '', isFreeDay: false }])}>+ Өдөр нэмэх</button>
        <button type="button" className="btn btn-primary" onClick={() => save('/days', 'PUT', { days: days.filter((d) => d.title.trim()) })}>Хөтөлбөр хадгалах</button>
      </div>
    </div>
  );
}

/* ---------------- Багтсан ---------------- */
function InclTab({ data, save }) {
  const [lists, setLists] = useState({ included: [...data.inclusions.included], excluded: [...data.inclusions.excluded], note: [...data.inclusions.notes] });
  const labels = { included: 'Үнэд багтсан', excluded: 'Үнэд багтаагүй', note: 'Анхаарах зүйлс' };
  return (
    <div className="stack gap-16">
      {Object.keys(labels).map((k) => (
        <div className="card" key={k}>
          <b>{labels[k]}</b>
          {lists[k].map((t, i) => (
            <div className="row gap-8" key={i}>
              <input className="input input-sm" style={{ flex: 1 }} value={t} aria-label={`${labels[k]} ${i + 1}`}
                onChange={(e) => setLists({ ...lists, [k]: lists[k].map((x, j) => (j === i ? e.target.value : x)) })} />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => setLists({ ...lists, [k]: lists[k].filter((_, j) => j !== i) })}>Устгах</button>
            </div>
          ))}
          <div><button type="button" className="btn btn-outline btn-sm" onClick={() => setLists({ ...lists, [k]: [...lists[k], ''] })}>+ Мөр нэмэх</button></div>
        </div>
      ))}
      <div><button type="button" className="btn btn-primary" onClick={() => save('/inclusions', 'PUT', {
        items: Object.entries(lists).flatMap(([kind, arr]) => arr.filter((t) => t.trim()).map((text) => ({ kind, text }))),
      })}>Хадгалах</button></div>
    </div>
  );
}

/* ---------------- Буудал, багц ---------------- */
function OptionsTab({ data, save, toast }) {
  const [hotels, setHotels] = useState([]);
  const [nf, setNf] = useState({ hotelId: '', packageType: 'guided', singleSupplement: 0 });
  const [nh, setNh] = useState({ name: '', stars: 5, city: '' });
  const loadHotels = useCallback(() => api('/admin/hotels').then(({ data: h }) => setHotels(h)).catch((e) => toast(e.message, true)), [toast]);
  useEffect(() => { loadHotels(); }, [loadHotels]);

  const addHotel = async () => {
    if (!nh.name.trim()) return;
    try {
      const { data: h } = await api('/admin/hotels', { method: 'POST', body: { ...nh, stars: Number(nh.stars) || null } });
      await loadHotels(); setNf({ ...nf, hotelId: String(h.id) }); setNh({ name: '', stars: 5, city: '' }); toast('Буудал нэмэгдлээ');
    } catch (e) { toast(e.message, true); }
  };

  return (
    <div className="stack gap-16">
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Буудал</th><th>Багц</th><th>Ганцаараа өрөө</th><th>Идэвхтэй</th><th /></tr></thead>
          <tbody>
            {data.options.length === 0 && <tr><td colSpan={5} className="muted">Сонголт алга. Доороос нэмнэ үү.</td></tr>}
            {data.options.map((o) => (
              <OptionRow key={o.id} o={o} save={save} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <b>Шинэ сонголт нэмэх</b>
        <div className="form-grid">
          <div className="field"><label htmlFor="o-h">Буудал</label>
            <select id="o-h" className="select" value={nf.hotelId} onChange={(e) => setNf({ ...nf, hotelId: e.target.value })}>
              <option value="">Буудалгүй</option>
              {hotels.map((h) => <option key={h.id} value={h.id}>{hotelLabel(h.name, h.stars)}{h.city ? `, ${h.city}` : ''}</option>)}
            </select></div>
          <div className="field"><label htmlFor="o-p">Багц</label>
            <select id="o-p" className="select" value={nf.packageType} onChange={(e) => setNf({ ...nf, packageType: e.target.value })}>
              <option value="guided">Хөтөлбөртэй</option><option value="free">Чөлөөт</option>
            </select></div>
          <div className="field"><label htmlFor="o-s">Ганцаараа өрөөний нэмэлт (₮)</label><input id="o-s" className="input" inputMode="numeric" value={nf.singleSupplement} onChange={(e) => setNf({ ...nf, singleSupplement: e.target.value.replace(/\D/g, '') })} /></div>
        </div>
        <div><button type="button" className="btn btn-primary" onClick={() => save('/options', 'POST', { hotelId: nf.hotelId ? Number(nf.hotelId) : null, packageType: nf.packageType, singleSupplement: Number(nf.singleSupplement) || 0, isActive: true, sortOrder: data.options.length + 1 })}>Нэмэх</button></div>
      </div>
      <div className="card">
        <b>Жагсаалтад байхгүй буудал үүсгэх</b>
        <div className="form-grid">
          <div className="field"><label htmlFor="h-n">Нэр</label><input id="h-n" className="input" value={nh.name} onChange={(e) => setNh({ ...nh, name: e.target.value })} /></div>
          <div className="field"><label htmlFor="h-s">Од</label><input id="h-s" type="number" min={1} max={5} className="input" value={nh.stars} onChange={(e) => setNh({ ...nh, stars: e.target.value })} /></div>
          <div className="field"><label htmlFor="h-c">Хот</label><input id="h-c" className="input" value={nh.city} onChange={(e) => setNh({ ...nh, city: e.target.value })} /></div>
        </div>
        <div><button type="button" className="btn btn-outline" onClick={addHotel}>Буудал үүсгэх</button></div>
      </div>
    </div>
  );
}

function OptionRow({ o, save }) {
  const [ss, setSs] = useState(String(o.singleSupplement));
  const [active, setActive] = useState(o.isActive);
  const body = (patch = {}) => ({ hotelId: o.hotelId, packageType: o.packageType, singleSupplement: Number(ss) || 0, isActive: active, sortOrder: o.sortOrder, ...patch });
  return (
    <tr>
      <td><b>{hotelLabel(o.hotelName, o.hotelStars) || 'Буудалгүй'}</b></td>
      <td>{PACKAGE[o.packageType]}</td>
      <td><input className="input input-sm" style={{ width: 130 }} inputMode="numeric" value={ss} onChange={(e) => setSs(e.target.value.replace(/\D/g, ''))} aria-label="Ганцаараа өрөөний нэмэлт" /></td>
      <td><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} aria-label="Идэвхтэй" style={{ width: 20, height: 20, accentColor: 'var(--teal)' }} /></td>
      <td><div className="row gap-8">
        <button type="button" className="btn btn-outline btn-sm" onClick={() => save(`/options/${o.id}`, 'PUT', body())}>Хадгалах</button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Энэ сонголт болон түүний бүх үнийг устгах уу?')) save(`/options/${o.id}`, 'DELETE'); }}>Устгах</button>
      </div></td>
    </tr>
  );
}

/* ---------------- Хуваарь ба үнэ ---------------- */
function PricesTab({ data, save }) {
  const [optId, setOptId] = useState(data.options[0]?.id);
  const [grid, setGrid] = useState({});
  const [nd, setNd] = useState({ startDate: '', endDate: '', seatsTotal: '' });
  const [infantAll, setInfantAll] = useState('');

  useEffect(() => {
    const g = {};
    data.departures.forEach((d) => {
      const p = d.prices[optId];
      g[d.id] = { adult: p ? String(p.adult) : '', child: p ? String(p.child) : '', infant: p ? String(p.infant) : '' };
    });
    setGrid(g);
  }, [data, optId]);

  // Шинэ хуваарийн дуусах огноог аяллын хоногоор автоматаар бөглөнө
  const onStart = (v) => {
    let end = nd.endDate;
    if (v) { const d = new Date(`${v}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + Math.max(0, data.tour.nights || data.tour.days - 1)); end = d.toISOString().slice(0, 10); }
    setNd({ ...nd, startDate: v, endDate: end });
  };

  const setCell = (depId, k, v) => setGrid((g) => ({ ...g, [depId]: { ...g[depId], [k]: v.replace(/\D/g, '') } }));
  const option = data.options.find((o) => o.id === optId);

  const savePrices = () => save('/prices', 'PUT', {
    prices: data.departures.map((d) => {
      const c = grid[d.id] || {};
      return {
        departureId: d.id, optionId: optId,
        adultPrice: c.adult ? Number(c.adult) : null,
        childPrice: c.child ? Number(c.child) : (c.adult ? Number(c.adult) : null),
        infantPrice: c.infant ? Number(c.infant) : 0,
      };
    }),
  });

  return (
    <div className="stack gap-16">
      <div className="card">
        <b>Хуваарь нэмэх</b>
        <div className="form-grid">
          <div className="field"><label htmlFor="nd-s">Эхлэх</label><input id="nd-s" type="date" className="input" value={nd.startDate} onChange={(e) => onStart(e.target.value)} /></div>
          <div className="field"><label htmlFor="nd-e">Дуусах</label><input id="nd-e" type="date" className="input" value={nd.endDate} onChange={(e) => setNd({ ...nd, endDate: e.target.value })} /></div>
          <div className="field"><label htmlFor="nd-q">Суудал (хоосон = хязгааргүй)</label><input id="nd-q" className="input" inputMode="numeric" value={nd.seatsTotal} onChange={(e) => setNd({ ...nd, seatsTotal: e.target.value.replace(/\D/g, '') })} /></div>
        </div>
        <div><button type="button" className="btn btn-primary" disabled={!nd.startDate || !nd.endDate}
          onClick={async () => { const ok = await save('/departures', 'POST', { startDate: nd.startDate, endDate: nd.endDate, seatsTotal: nd.seatsTotal ? Number(nd.seatsTotal) : null, status: 'open' }); if (ok) setNd({ startDate: '', endDate: '', seatsTotal: '' }); }}>Нэмэх</button></div>
      </div>

      {data.options.length === 0 ? <div className="info-box">Үнэ оруулахын өмнө "Буудал, багц" табаас сонголт нэмнэ үү.</div> : (
        <>
          <div className="row between gap-12">
            <div className="row gap-8" role="group" aria-label="Үнийн хүснэгт">
              {data.options.map((o) => (
                <button key={o.id} type="button" className="filter-pill" aria-pressed={o.id === optId} onClick={() => setOptId(o.id)}>
                  {[o.hotelName, PACKAGE[o.packageType]].filter(Boolean).join(', ')}
                </button>
              ))}
            </div>
            <div className="row gap-8">
              <input className="input input-sm" style={{ width: 150 }} placeholder="Нярайн үнэ" inputMode="numeric" value={infantAll} onChange={(e) => setInfantAll(e.target.value.replace(/\D/g, ''))} aria-label="Бүх мөрөнд нярайн үнэ" />
              <button type="button" className="btn btn-outline btn-sm" disabled={!infantAll}
                onClick={() => setGrid((g) => Object.fromEntries(Object.entries(g).map(([k, v]) => [k, { ...v, infant: v.adult ? infantAll : v.infant }])))}>Бүгдэд тавих</button>
            </div>
          </div>
          {option?.singleSupplement > 0 && <span className="muted" style={{ fontSize: 14 }}>Ганцаараа өрөөний нэмэлт: {money(option.singleSupplement)}</span>}
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Хуваарь</th><th>Том хүн (12+)</th><th>Хүүхэд (2–11)</th><th>Нярай (0–1.99)</th><th>Суудал</th><th>Төлөв</th><th /></tr></thead>
              <tbody>
                {data.departures.length === 0 && <tr><td colSpan={7} className="muted">Хуваарь алга. Дээрээс нэмнэ үү.</td></tr>}
                {data.departures.map((d) => (
                  <DepRow key={d.id} d={d} cell={grid[d.id] || {}} setCell={setCell} save={save} />
                ))}
              </tbody>
            </table>
          </div>
          <span className="muted" style={{ fontSize: 13 }}>Том хүний үнийг хоосон үлдээвэл тэр хуваарьт энэ сонголт зарагдахгүй.</span>
          <div><button type="button" className="btn btn-primary" onClick={savePrices}>Үнэ хадгалах</button></div>
        </>
      )}
    </div>
  );
}

function DepRow({ d, cell, setCell, save }) {
  const [seats, setSeats] = useState(d.seatsTotal ?? '');
  const [status, setStatus] = useState(d.status);
  const dirty = String(seats) !== String(d.seatsTotal ?? '') || status !== d.status;
  return (
    <tr>
      <td style={{ whiteSpace: 'nowrap' }}><b>{range(d.startDate, d.endDate)}</b><br /><span className="muted" style={{ fontSize: 12 }}>Захиалсан: {d.seatsTaken}</span></td>
      {['adult', 'child', 'infant'].map((k) => (
        <td key={k}><input className="input input-sm" style={{ width: 120, textAlign: 'right' }} inputMode="numeric" placeholder="—"
          value={cell[k] ? Number(cell[k]).toLocaleString('en-US') : ''} onChange={(e) => setCell(d.id, k, e.target.value)} aria-label={`${range(d.startDate, d.endDate)} ${k}`} /></td>
      ))}
      <td><input className="input input-sm" style={{ width: 80 }} inputMode="numeric" value={seats} onChange={(e) => setSeats(e.target.value.replace(/\D/g, ''))} aria-label="Суудал" /></td>
      <td><select className="select input-sm" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Төлөв">
        <option value="open">Нээлттэй</option><option value="closed">Хаалттай</option><option value="cancelled">Цуцлагдсан</option></select></td>
      <td><div className="row gap-8" style={{ flexWrap: 'nowrap' }}>
        {dirty && <button type="button" className="btn btn-outline btn-sm" onClick={() => save(`/departures/${d.id}`, 'PUT', { startDate: d.startDate, endDate: d.endDate, seatsTotal: seats === '' ? null : Number(seats), status })}>Хадгалах</button>}
        <a className="btn btn-outline btn-sm" href={`/api/admin/departures/${d.id}/manifest.xlsx`} title="Аялагчдын жагсаалт Excel-ээр татах">Excel</a>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Хуваарийг устгах уу?')) save(`/departures/${d.id}`, 'DELETE'); }}>Устгах</button>
      </div></td>
    </tr>
  );
}

/* ---------------- Зураг ---------------- */
function ImagesTab({ data, save, setData, toast }) {
  const [dayId, setDayId] = useState('');
  const [busy, setBusy] = useState(false);

  const upload = async (files) => {
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append('files', f));
    if (dayId) fd.append('dayId', dayId);
    setBusy(true);
    try {
      const { data: d, message } = await api(`/admin/tours/${data.tour.id}/images`, { method: 'POST', form: fd });
      setData(d); toast(message);
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  return (
    <div className="stack gap-16">
      <div className="card">
        <b>Зураг оруулах</b>
        <div className="form-grid">
          <div className="field"><label htmlFor="up-day">Аль өдөрт хамаарах</label>
            <select id="up-day" className="select" value={dayId} onChange={(e) => setDayId(e.target.value)}>
              <option value="">Ерөнхий галерей</option>
              {data.days.map((d) => <option key={d.id} value={d.id}>Өдөр {d.dayNo}: {d.title}</option>)}
            </select></div>
          <div className="field"><label htmlFor="up-f">Файл (JPG, PNG, WEBP, 8MB хүртэл)</label>
            <input id="up-f" type="file" accept="image/jpeg,image/png,image/webp" multiple className="input" style={{ paddingTop: 12 }} disabled={busy} onChange={(e) => { upload(e.target.files); e.target.value = ''; }} /></div>
        </div>
        {busy && <div className="row gap-8"><span className="spinner" />Оруулж байна…</div>}
      </div>
      <div className="img-grid">
        {data.images.map((im) => (
          <div className="img-tile" key={im.id}>
            <img src={im.url} alt={im.alt || ''} />
            <div className="ctl">
              {im.isCover ? <span className="badge tone-teal" style={{ alignSelf: 'flex-start' }}>Нүүр зураг</span>
                : <button type="button" className="btn btn-outline btn-sm" onClick={() => save(`/images/${im.id}`, 'PATCH', { isCover: true })}>Нүүр зураг болгох</button>}
              <select className="select input-sm" value={im.dayId ?? ''} aria-label="Өдөр"
                onChange={(e) => save(`/images/${im.id}`, 'PATCH', { dayId: e.target.value ? Number(e.target.value) : null })}>
                <option value="">Ерөнхий галерей</option>
                {data.days.map((d) => <option key={d.id} value={d.id}>Өдөр {d.dayNo}</option>)}
              </select>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Зургийг устгах уу?')) save(`/images/${im.id}`, 'DELETE'); }}>Устгах</button>
            </div>
          </div>
        ))}
      </div>
      {data.images.length === 0 && <div className="empty" style={{ background: '#fff' }}>Зураг алга.</div>}
    </div>
  );
}

export default function TourEditPage({ params }) {
  const id = params.id;
  const [toast, toastNode] = useToast();
  const [tab, setTab] = useState('general');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [ver, setVer] = useState(0);

  useEffect(() => { api(`/admin/tours/${id}`).then(({ data: d }) => setData(d)).catch((e) => setErr(e.message)); }, [id]);

  /** Бүх засварын нэг цэг: амжилттай бол шинэ өгөгдлөөр солино */
  const save = useCallback(async (path, method, body) => {
    try {
      const { data: d, message } = await api(`/admin/tours/${id}${path}`, { method, body });
      const next = d?.days ? d : d?.tour?.days ? d.tour : null;
      if (next) setData(next);
      setVer((v) => v + 1);
      toast(message === 'OK' ? 'Хадгаллаа' : message);
      return true;
    } catch (e) { toast(e.message, true); return false; }
  }, [id, toast]);

  const statusLabel = useMemo(() => ({ draft: ['Ноорог', 'gray'], published: ['Нийтлэгдсэн', 'green'], archived: ['Архивласан', 'orange'] }), []);

  if (err) return <div className="error-box">{err}</div>;
  if (!data) return <div className="spinner" />;
  const [sl, tone] = statusLabel[data.tour.status];

  return (
    <>
      <div className="row between gap-16">
        <div className="stack gap-4">
          <Link href="/admin/tours" className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Аяллууд</Link>
          <div className="row gap-12"><h1>{data.tour.title}</h1><span className={`badge tone-${tone}`}>{sl}</span></div>
        </div>
        <div className="row gap-8">
          <a href={`/print/${data.tour.slug}`} target="_blank" rel="noopener" className="btn btn-outline">Хөтөлбөр PDF</a>
          {data.tour.status === 'published' && <Link href={`/tours/${data.tour.slug}`} target="_blank" className="btn btn-outline">Сайт дээр харах</Link>}
        </div>
      </div>
      <div className="tabs" role="tablist">
        {TABS.map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      <div key={`${tab}-${tab === 'prices' || tab === 'images' || tab === 'options' ? ver : 0}`}>
        {tab === 'general' && <GeneralTab data={data} save={save} />}
        {tab === 'days' && <DaysTab data={data} save={save} />}
        {tab === 'incl' && <InclTab data={data} save={save} />}
        {tab === 'options' && <OptionsTab data={data} save={save} toast={toast} />}
        {tab === 'prices' && <PricesTab data={data} save={save} />}
        {tab === 'images' && <ImagesTab data={data} save={save} setData={setData} toast={toast} />}
      </div>
      {toastNode}
    </>
  );
}
