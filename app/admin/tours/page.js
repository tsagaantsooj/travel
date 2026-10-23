'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';
import { CATEGORY } from '@/lib/format';

const STATUS = { draft: ['Ноорог', 'gray'], published: ['Нийтлэгдсэн', 'green'], archived: ['Архивласан', 'orange'] };

function slugify(s) {
  const map = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'j',з:'z',и:'i',й:'i',к:'k',л:'l',м:'m',н:'n',о:'o',ө:'u',п:'p',р:'r',с:'s',т:'t',у:'u',ү:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sh',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return s.toLowerCase().split('').map((c) => map[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);
}

export default function AdminToursPage() {
  const router = useRouter();
  const [toast, toastNode] = useToast();
  const [tours, setTours] = useState(null);
  const [creating, setCreating] = useState(false);
  const [f, setF] = useState({ title: '', slug: '', category: 'abroad', country: '', days: 5, nights: 4 });

  useEffect(() => { api('/admin/tours').then(({ data }) => setTours(data)).catch((e) => toast(e.message, true)); }, [toast]);

  const create = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api('/admin/tours', { method: 'POST', body: { ...f, slug: f.slug || slugify(f.title), status: 'draft' } });
      router.push(`/admin/tours/${data.id}`);
    } catch (e2) { toast(e2.message, true); }
  };

  return (
    <>
      <div className="row between gap-16">
        <h1>Аяллууд</h1>
        <button type="button" className="btn btn-primary" onClick={() => setCreating((v) => !v)}>{creating ? 'Болих' : 'Шинэ аялал'}</button>
      </div>
      {creating && (
        <form className="card" onSubmit={create}>
          <div className="form-grid">
            <div className="field"><label htmlFor="n-title">Нэр</label><input id="n-title" className="input" required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value, slug: slugify(e.target.value) })} /></div>
            <div className="field"><label htmlFor="n-slug">URL (slug)</label><input id="n-slug" className="input" required value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
            <div className="field"><label htmlFor="n-cat">Ангилал</label><select id="n-cat" className="select" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>{Object.entries(CATEGORY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div className="field"><label htmlFor="n-country">Улс</label><input id="n-country" className="input" required value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} /></div>
            <div className="field"><label htmlFor="n-days">Өдөр</label><input id="n-days" type="number" min={1} className="input" value={f.days} onChange={(e) => setF({ ...f, days: e.target.value })} /></div>
            <div className="field"><label htmlFor="n-nights">Шөнө</label><input id="n-nights" type="number" min={0} className="input" value={f.nights} onChange={(e) => setF({ ...f, nights: e.target.value })} /></div>
          </div>
          <div><button type="submit" className="btn btn-primary">Үүсгээд засах</button></div>
        </form>
      )}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Аялал</th><th>Ангилал</th><th>Ойрын хуваарь</th><th>Идэвхтэй захиалга</th><th>Төлөв</th><th /></tr></thead>
          <tbody>
            {!tours && <tr><td colSpan={6}><div className="spinner" /></td></tr>}
            {tours?.length === 0 && <tr><td colSpan={6} className="muted">Аялал алга. "Шинэ аялал" товчоор нэмнэ үү.</td></tr>}
            {tours?.map((t) => (
              <tr key={t.id}>
                <td><div className="row gap-12">
                  <span style={{ width: 56, height: 42, borderRadius: 8, overflow: 'hidden', background: '#E6EEED', flex: '0 0 auto' }}>{t.cover_image_url && <img src={t.cover_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</span>
                  <div className="stack"><b>{t.title}</b><span className="muted" style={{ fontSize: 13 }}>{t.country}, {t.days} өдөр</span></div>
                </div></td>
                <td>{CATEGORY[t.category]}</td>
                <td>{t.upcoming_departures}</td>
                <td>{t.active_bookings}</td>
                <td><span className={`badge tone-${STATUS[t.status][1]}`}>{STATUS[t.status][0]}</span></td>
                <td><Link href={`/admin/tours/${t.id}`} className="btn btn-outline btn-sm">Засах</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toastNode}
    </>
  );
}
