'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';

const TONES = { light: 'Цагаан товч', blue: 'Цэнхэр товч', sun: 'Шар товч' };
const empty = { title: '', subtitle: '', buttonText: 'Дэлгэрэнгүй', linkUrl: '/tours', tone: 'light', sortOrder: 0, isActive: true, startsOn: '', endsOn: '' };

function PromoForm({ initial, onSave, onCancel, submitLabel }) {
  const [f, setF] = useState({ ...empty, ...initial, startsOn: initial?.startsOn || '', endsOn: initial?.endsOn || '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <form className="stack gap-12" onSubmit={(e) => { e.preventDefault(); onSave({ ...f, sortOrder: Number(f.sortOrder) || 0 }); }}>
      <div className="form-grid">
        <div className="field"><label>Гарчиг<input className="input" required value={f.title} onChange={set('title')} /></label></div>
        <div className="field"><label>Дэд бичвэр<input className="input" value={f.subtitle || ''} onChange={set('subtitle')} /></label></div>
        <div className="field"><label>Товчны бичвэр<input className="input" value={f.buttonText || ''} onChange={set('buttonText')} /></label></div>
        <div className="field"><label>Холбоос (/tours/natrang-8-udur гэх мэт)<input className="input" value={f.linkUrl || ''} onChange={set('linkUrl')} /></label></div>
        <div className="field"><label>Товчны өнгө<select className="select" value={f.tone} onChange={set('tone')}>{Object.entries(TONES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label></div>
        <div className="field"><label>Эрэмбэ (их нь эхэнд)<input className="input" type="number" value={f.sortOrder} onChange={set('sortOrder')} /></label></div>
        <div className="field"><label>Эхлэх огноо<input className="input" type="date" value={f.startsOn} onChange={set('startsOn')} /></label></div>
        <div className="field"><label>Дуусах огноо<input className="input" type="date" value={f.endsOn} onChange={set('endsOn')} /></label></div>
      </div>
      <label className="check"><input type="checkbox" checked={f.isActive} onChange={set('isActive')} />Сайт дээр харуулах</label>
      <div className="row gap-8">
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
        {onCancel && <button type="button" className="btn btn-outline" onClick={onCancel}>Болих</button>}
      </div>
    </form>
  );
}

export default function PromotionsPage() {
  const [toast, toastNode] = useToast();
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => api('/admin/promotions').then(({ data }) => setItems(data)).catch((e) => toast(e.message, true)), [toast]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn, msg) => { try { await fn(); toast(msg); await load(); return true; } catch (e) { toast(e.message, true); return false; } };

  const upload = (id, file) => {
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    run(() => api(`/admin/promotions/${id}/image`, { method: 'POST', form: fd }), 'Зураг хадгалагдлаа');
  };

  return (
    <>
      <div className="row between gap-16">
        <h1>Урамшуулал</h1>
        <button type="button" className="btn btn-primary" onClick={() => setCreating((v) => !v)}>{creating ? 'Болих' : 'Шинэ урамшуулал'}</button>
      </div>
      <p className="muted">Нүүр хуудасны "Special offer" хэсэгт эрэмбээрээ хамгийн ихдээ 6 карт гарна. Зурагт 4:5 харьцаатай, 1200px орчим өргөнтэй зураг тохиромжтой.</p>
      {creating && (
        <section className="card">
          <PromoForm submitLabel="Үүсгэх" onCancel={() => setCreating(false)}
            onSave={async (b) => { if (await run(() => api('/admin/promotions', { method: 'POST', body: b }), 'Үүслээ')) setCreating(false); }} />
        </section>
      )}
      {!items && <div className="spinner" />}
      {items?.length === 0 && <div className="empty">Урамшуулал алга.</div>}
      <div className="stack gap-16">
        {items?.map((p) => (
          <section className="card" key={p.id}>
            <div className="row gap-20" style={{ alignItems: 'flex-start' }}>
              <div style={{ width: 180, height: 220, borderRadius: 14, overflow: 'hidden', background: 'var(--ink)', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 13 }}>Зураггүй</span>}
              </div>
              <div className="stack gap-8" style={{ flex: '1 1 300px' }}>
                {editing === p.id ? (
                  <PromoForm initial={p} submitLabel="Хадгалах" onCancel={() => setEditing(null)}
                    onSave={async (b) => { if (await run(() => api(`/admin/promotions/${p.id}`, { method: 'PUT', body: b }), 'Хадгаллаа')) setEditing(null); }} />
                ) : (
                  <>
                    <div className="row gap-8"><b style={{ fontSize: 18 }}>{p.title}</b>{!p.isActive && <span className="badge tone-gray">Нуусан</span>}</div>
                    {p.subtitle && <span className="muted">{p.subtitle}</span>}
                    <span className="muted" style={{ fontSize: 14 }}>{p.buttonText} → {p.linkUrl || '—'}, {TONES[p.tone]}, эрэмбэ {p.sortOrder}{p.startsOn || p.endsOn ? `, ${p.startsOn || '…'} – ${p.endsOn || '…'}` : ''}</span>
                    <div className="row gap-8" style={{ marginTop: 8 }}>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(p.id)}>Засах</button>
                      <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                        Зураг солих
                        <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => { upload(p.id, e.target.files?.[0]); e.target.value = ''; }} />
                      </label>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => { if (window.confirm('Устгах уу?')) run(() => api(`/admin/promotions/${p.id}`, { method: 'DELETE' }), 'Устгалаа'); }}>Устгах</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
      {toastNode}
    </>
  );
}
