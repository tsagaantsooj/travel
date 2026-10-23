'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TourCard from './TourCard';
import { IconPin, IconCalendar, IconGrid, IconChevronDown, IconSort } from './Icons';
import { PACKAGE } from '@/lib/format';

const MONTH = (ym) => `${Number(ym.slice(5))}-р сар${ym.slice(0, 4) !== String(new Date().getFullYear()) ? ` (${ym.slice(0, 4)})` : ''}`;
const SORTS = [['date', 'Ойрын хөдлөх'], ['asc', 'Үнэ өсөхөөр'], ['desc', 'Үнэ буурахаар']];

function Dropdown({ id, open, setOpen, icon: Ic, label, active, right, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" className={`fpill${active ? ' active' : ''}`} aria-expanded={open === id} aria-haspopup="listbox"
        onClick={() => setOpen(open === id ? '' : id)}>
        <Ic size={17} style={{ color: 'var(--teal)' }} />{label}<IconChevronDown className="chev" size={16} />
      </button>
      {open === id && <div className={`fmenu${right ? ' right' : ''}`} role="listbox">{children}</div>}
    </div>
  );
}

export default function ToursBrowser({ tours, initial }) {
  const router = useRouter();
  const pathname = usePathname();
  const [f, setF] = useState({ country: initial.country || '', month: initial.month || '', pkg: initial.pkg || '' });
  const [sort, setSort] = useState('date');
  const [open, setOpen] = useState('');
  const [loading, setLoading] = useState(false);
  const [gen, setGen] = useState(0);
  const first = useRef(true);

  const barRef = useRef(null);
  useEffect(() => {
    // Шүүлтүүрийн мөрөөс гадуур дарвал dropdown хаагдана
    const close = (e) => { if (barRef.current && !barRef.current.contains(e.target)) setOpen(''); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(''); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, []);

  // Шүүлтүүрийг URL-д тусгана (хуваалцах боломжтой), хуудас дахин ачаалахгүй
  useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    const q = new URLSearchParams();
    if (initial.category) q.set('category', initial.category);
    Object.entries(f).forEach(([k, v]) => { if (v) q.set(k, v); });
    window.history.replaceState(null, '', `${pathname}${q.toString() ? `?${q}` : ''}`);
    setLoading(true);
    const t = setTimeout(() => { setLoading(false); setGen((g) => g + 1); }, 380);
    return () => clearTimeout(t);
  }, [f, sort, pathname, initial.category]);

  const match = (t, x) => (!x.country || t.country === x.country) && (!x.month || (t.months || []).includes(x.month)) && (!x.pkg || (t.packageTypes || []).includes(x.pkg));

  const countries = useMemo(() => [...new Set(tours.map((t) => t.country))].sort(), [tours]);
  const monthsAll = useMemo(() => [...new Set(tours.flatMap((t) => t.months || []))].sort(), [tours]);
  const list = useMemo(() => tours.filter((t) => match(t, f)).sort((a, b) => {
    if (sort === 'asc') return (a.minPrice || 9e12) - (b.minPrice || 9e12);
    if (sort === 'desc') return (b.minPrice || 0) - (a.minPrice || 0);
    return (a.nextStart || '9999') < (b.nextStart || '9999') ? -1 : 1;
  }), [tours, f, sort]);

  const pick = (k, v) => { setF((x) => ({ ...x, [k]: v })); setOpen(''); };
  const count = (k, v) => tours.filter((t) => match(t, { ...f, [k]: v })).length;
  const opt = (k, v, label) => {
    const n = count(k, v);
    const sel = f[k] === v;
    return (
      <button key={v || 'all'} type="button" role="option" aria-selected={sel} className={`fopt${n === 0 ? ' dim' : ''}`} onClick={() => pick(k, v)}>
        <span>{label}</span><span className="row gap-8"><small>{n}</small><span style={{ width: 16, color: 'var(--teal)', fontWeight: 800 }}>{sel ? '✓' : ''}</span></span>
      </button>
    );
  };
  const chips = [
    f.country && { k: 'country', label: f.country },
    f.month && { k: 'month', label: MONTH(f.month) },
    f.pkg && { k: 'pkg', label: PACKAGE[f.pkg] },
  ].filter(Boolean);

  return (
    <>
      <div className="filterbar" ref={barRef}>
        <div className="in">
          <Dropdown id="country" open={open} setOpen={setOpen} icon={IconPin} label={f.country || 'Чиглэл'} active={!!f.country}>
            {opt('country', '', 'Бүх чиглэл')}{countries.map((c) => opt('country', c, c))}
          </Dropdown>
          <Dropdown id="month" open={open} setOpen={setOpen} icon={IconCalendar} label={f.month ? MONTH(f.month) : 'Хөдлөх огноо'} active={!!f.month}>
            {opt('month', '', 'Бүгд')}{monthsAll.map((m) => opt('month', m, MONTH(m)))}
          </Dropdown>
          <Dropdown id="pkg" open={open} setOpen={setOpen} icon={IconGrid} label={f.pkg ? PACKAGE[f.pkg] : 'Аяллын төрөл'} active={!!f.pkg}>
            {opt('pkg', '', 'Бүгд')}{opt('pkg', 'guided', 'Хөтөлбөртэй')}{opt('pkg', 'free', 'Чөлөөт')}
          </Dropdown>
          <span style={{ flex: 1 }} />
          <span className="muted" style={{ fontWeight: 600 }}>{list.length} аялал</span>
          <Dropdown id="sort" open={open} setOpen={setOpen} icon={IconSort} label={SORTS.find((s) => s[0] === sort)[1]} right>
            {SORTS.map(([k, l]) => (
              <button key={k} type="button" role="option" aria-selected={sort === k} className="fopt" onClick={() => { setSort(k); setOpen(''); }}>
                <span>{l}</span><span style={{ color: 'var(--teal)', fontWeight: 800 }}>{sort === k ? '✓' : ''}</span>
              </button>
            ))}
          </Dropdown>
        </div>
        {chips.length > 0 && (
          <div className="in" style={{ paddingTop: 0 }}>
            {chips.map((c) => (
              <span key={c.k} className="fchip">{c.label}<button type="button" onClick={() => pick(c.k, '')} aria-label={`${c.label} шүүлтүүр арилгах`}>×</button></span>
            ))}
            <button type="button" className="btn-link" style={{ color: 'var(--muted)', textDecoration: 'underline' }} onClick={() => setF({ country: '', month: '', pkg: '' })}>Бүгдийг цэвэрлэх</button>
          </div>
        )}
      </div>

      <div className="wrap" style={{ padding: '32px 24px 0' }}>
        {loading ? (
          <div className="tour-grid" aria-busy="true">
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ borderRadius: 26, overflow: 'hidden', border: '1px solid #EEF2F7' }}>
                <div className="sk" style={{ aspectRatio: '4 / 3.2' }} />
                <div className="stack gap-12" style={{ padding: 20 }}><span className="sk" style={{ height: 14, width: '40%', borderRadius: 8 }} /><span className="sk" style={{ height: 20, width: '80%', borderRadius: 8 }} /><span className="sk" style={{ height: 24, width: '50%', borderRadius: 8 }} /></div>
              </div>
            ))}
          </div>
        ) : list.length ? (
          <div className="tour-grid" key={gen}>{list.map((t, k) => <TourCard key={t.id} t={t} enter delay={k * 60} />)}</div>
        ) : (
          <div className="empty">
            <b>Энэ шүүлтүүрт тохирох аялал алга</b>
            <span>Огноо эсвэл чиглэлээ өөрчилж үзээрэй, эсвэл захиалгат аялал хүсэлт илгээгээрэй.</span>
            <div className="row gap-8" style={{ justifyContent: 'center' }}>
              <button type="button" className="pill-dark" style={{ border: 0, cursor: 'pointer' }} onClick={() => setF({ country: '', month: '', pkg: '' })}>Шүүлтүүрийг цэвэрлэх</button>
              <button type="button" className="pill-outline" onClick={() => router.push('/#custom')}>Захиалгат аялал</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
