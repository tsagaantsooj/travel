'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/useToast';
import { dateTime } from '@/lib/format';

const ST = { new: ['Шинэ', 'blue'], contacted: ['Холбогдсон', 'teal'], won: ['Захиалга болсон', 'green'], lost: ['Болоогүй', 'gray'] };

function Row({ r, onSaved, toast }) {
  const [status, setStatus] = useState(r.status);
  const [note, setNote] = useState(r.admin_note || '');
  const dirty = status !== r.status || note !== (r.admin_note || '');
  const save = async () => {
    try { await api(`/admin/leads/${r.id}`, { method: 'PUT', body: { status, adminNote: note } }); toast('Хадгаллаа'); onSaved(); }
    catch (e) { toast(e.message, true); }
  };
  return (
    <tr>
      <td style={{ whiteSpace: 'nowrap' }}>{dateTime(r.created_at)}<br /><span className="muted" style={{ fontSize: 12 }}>{r.source === 'assistant' ? 'AI туслах' : 'Форм'}</span></td>
      <td><b>{r.name || '—'}</b><br /><a href={`tel:${r.phone}`}>{r.phone}</a></td>
      <td>{r.destination || '—'}<br /><span className="muted" style={{ fontSize: 13 }}>{[r.travel_when, r.group_size && `${r.group_size} хүн`].filter(Boolean).join(', ')}</span>{r.note && <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{r.note}</div>}</td>
      <td><select className="select input-sm" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Төлөв">{Object.entries(ST).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}</select></td>
      <td><input className="input input-sm" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Тэмдэглэл" aria-label="Тэмдэглэл" style={{ minWidth: 180 }} /></td>
      <td>{dirty && <button type="button" className="btn btn-primary btn-sm" onClick={save}>Хадгалах</button>}</td>
    </tr>
  );
}

export default function LeadsPage() {
  const [toast, toastNode] = useToast();
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const load = useCallback(() => api(`/admin/leads${status ? `?status=${status}` : ''}`).then(({ data: d }) => setData(d)).catch((e) => toast(e.message, true)), [status, toast]);
  useEffect(() => { load(); }, [load]);
  const c = data?.counts || {};
  return (
    <>
      <h1>Захиалгат аяллын хүсэлт</h1>
      <div className="row gap-8">
        <button type="button" className="filter-pill" aria-pressed={!status} onClick={() => setStatus('')}>Бүгд</button>
        {Object.entries(ST).map(([k, [l]]) => <button key={k} type="button" className="filter-pill" aria-pressed={status === k} onClick={() => setStatus(k)}>{l} · {c[k] || 0}</button>)}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Огноо</th><th>Хэн</th><th>Хүсэлт</th><th>Төлөв</th><th>Тэмдэглэл</th><th /></tr></thead>
          <tbody>
            {!data && <tr><td colSpan={6}><div className="spinner" /></td></tr>}
            {data?.items.length === 0 && <tr><td colSpan={6} className="muted">Хүсэлт алга</td></tr>}
            {data?.items.map((r) => <Row key={`${r.id}-${r.status}-${r.admin_note}`} r={r} onSaved={load} toast={toast} />)}
          </tbody>
        </table>
      </div>
      {toastNode}
    </>
  );
}
