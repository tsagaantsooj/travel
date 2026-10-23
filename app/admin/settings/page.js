'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';

const GROUPS = [
  { title: 'Компанийн мэдээлэл', fields: [
    ['company_name', 'Компанийн нэр', 'Batbileg Travel'],
    ['tagline', 'Уриа', 'Аялъя, амаръя!'],
    ['phone', 'Утас', '7272-4242'],
    ['phone2', 'Нэмэлт утас', ''],
    ['email', 'И-мэйл', 'sales@company.mn'],
    ['address', 'Хаяг', 'Улаанбаатар, ... дүүрэг ...', 'textarea'],
    ['map_url', 'Газрын зургийн холбоос (Google Maps)', 'https://maps.app.goo.gl/...'],
  ] },
  { title: 'Сошиал, чат', fields: [
    ['facebook_url', 'Facebook хуудас', 'https://facebook.com/yourpage'],
    ['instagram_url', 'Instagram', 'https://instagram.com/yourpage'],
    ['youtube_url', 'YouTube', 'https://youtube.com/@yourchannel'],
    ['messenger_user', 'Messenger (Facebook page username)', 'yourpage  →  m.me/yourpage'],
    ['viber_phone', 'Viber дугаар', '+97699112233'],
    ['fb_pixel_id', 'Facebook Pixel ID', '123456789012345'],
  ] },
  { title: 'Нүүр хуудас', fields: [
    ['hero_title', 'Гол гарчиг', 'Аялъя, амаръя, дурсамж бүтээе'],
    ['hero_subtitle', 'Дэд бичвэр', '', 'textarea'],
  ] },
  { title: 'Аяллын нөхцөл, цуцлалтын журам', fields: [
    ['terms_text', 'Нөхцөлийн бичвэр (/terms хуудсанд гарна)', '', 'textarea-lg'],
  ] },
];

export default function SettingsPage() {
  const [toast, toastNode] = useToast();
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api('/admin/settings').then(({ data }) => setS(data)).catch((e) => toast(e.message, true)); }, [toast]);

  const save = async () => {
    setBusy(true);
    try {
      const keys = GROUPS.flatMap((g) => g.fields.map((f) => f[0]));
      const settings = Object.fromEntries(keys.map((k) => [k, s[k] ?? '']));
      const { data, message } = await api('/admin/settings', { method: 'PUT', body: { settings } });
      setS(data); toast(message);
    } catch (e) { toast(e.message, true); } finally { setBusy(false); }
  };

  const uploadHero = async (file) => {
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try { const { data, message } = await api('/admin/settings/image?key=hero_image_url', { method: 'POST', form: fd }); setS(data); toast(message); }
    catch (e) { toast(e.message, true); }
  };

  if (!s) return <div className="spinner" />;
  return (
    <>
      <div className="row between gap-16">
        <h1>Сайтын тохиргоо</h1>
        <button type="button" className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'Хадгалж байна…' : 'Хадгалах'}</button>
      </div>
      {GROUPS.map((g) => (
        <section className="card" key={g.title}>
          <b style={{ fontSize: 17 }}>{g.title}</b>
          <div className="form-grid">
            {g.fields.map(([k, label, ph, type]) => (
              <div className="field" key={k} style={type?.startsWith('textarea') ? { gridColumn: '1 / -1' } : undefined}>
                <label htmlFor={`s-${k}`}>{label}</label>
                {type?.startsWith('textarea')
                  ? <textarea id={`s-${k}`} className="textarea" style={type === 'textarea-lg' ? { minHeight: 260 } : undefined} placeholder={ph} value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
                  : <input id={`s-${k}`} className="input" placeholder={ph} value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
              </div>
            ))}
          </div>
          {g.title === 'Нүүр хуудас' && (
            <div className="row gap-16" style={{ alignItems: 'flex-start' }}>
              <div style={{ width: 280, height: 170, borderRadius: 12, overflow: 'hidden', background: '#E3EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.hero_image_url ? <img src={s.hero_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="muted">Зураг алга</span>}
              </div>
              <div className="field" style={{ flex: '1 1 260px' }}>
                <label htmlFor="hero-img">Нүүр зураг (хоосон бол эхний аяллын зураг гарна)</label>
                <input id="hero-img" type="file" accept="image/jpeg,image/png,image/webp" className="input" style={{ paddingTop: 12 }} onChange={(e) => { uploadHero(e.target.files?.[0]); e.target.value = ''; }} />
              </div>
            </div>
          )}
        </section>
      ))}
      <div><button type="button" className="btn btn-primary" onClick={save} disabled={busy}>Хадгалах</button></div>
      {toastNode}
    </>
  );
}
