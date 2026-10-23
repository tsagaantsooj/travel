'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { dateTime } from '@/lib/format';

export default function AssistantLogsPage() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  useEffect(() => { api('/admin/assistant/logs').then(({ data: d }) => setData(d)).catch((e) => setErr(e.message)); }, []);
  const items = useMemo(() => (data?.items || []).filter((r) => !q || r.question.toLowerCase().includes(q.toLowerCase())), [data, q]);
  return (
    <>
      <div className="row between gap-16">
        <h1>AI туслахын харилцаа</h1>
        <input className="input input-sm" style={{ width: 260 }} placeholder="Асуултаас хайх" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Хайх" />
      </div>
      {data && !data.enabled && <div className="info-box">Туслах идэвхгүй байна. Backend-ийн .env дээр ANTHROPIC_API_KEY тохируулахад сайт дээр гарч ирнэ.</div>}
      {err && <div className="error-box">{err}</div>}
      <p className="muted">Хэрэглэгчид юу асууж байгааг эндээс харж, шинэ аялал, түгээмэл асуултын санаа аваарай. Сүүлийн 300 асуулт харагдана.</p>
      <div className="stack gap-12">
        {!data && !err && <div className="spinner" />}
        {items.map((r) => (
          <div key={r.id} className="card" style={{ gap: 10 }}>
            <div className="row between gap-8"><span className="muted" style={{ fontSize: 13 }}>{dateTime(r.created_at)} · {r.session_id.slice(0, 8)}</span>{r.tools_used && <span className="badge tone-teal">{r.tools_used}</span>}</div>
            <b>{r.question}</b>
            <div style={{ whiteSpace: 'pre-line', fontSize: 14, color: 'var(--ink-2)' }}>{r.answer}</div>
          </div>
        ))}
        {data && items.length === 0 && <div className="empty">Бичлэг алга</div>}
      </div>
    </>
  );
}
