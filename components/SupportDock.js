'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useSite } from './SiteProvider';
import { contactLinks } from '@/lib/site';
import { money, range, duration } from '@/lib/format';
import { IconPlus, IconUp, IconMessenger, IconViber, IconPhone, IconMail, IconChat, IconClose, IconSend, IconPlane, IconImage } from './Icons';

const GREETING = { role: 'assistant', content: 'Сайн байна уу! Би аяллын туслах. Аялал, хуваарь, үнийн талаар асуугаарай.', cards: [], chips: ['Ямар гадаад аялал байна?', 'Энэ сард хөдлөх аялал', 'Хүүхдийн үнэ хэд вэ?', 'Оператортой ярих'] };
const STORE = 'bb_chat_v1';

function ContactButtons({ l }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
      {l.messenger && <a href={l.messenger} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'linear-gradient(135deg,#00B2FF,#A033FF)', color: '#fff', borderRadius: 14 }}><IconMessenger size={18} />Messenger</a>}
      {l.phone && <a href={l.phone} className="btn btn-dark" style={{ borderRadius: 14 }}><IconPhone size={16} />Залгах</a>}
      {l.viber && <a href={l.viber} className="btn" style={{ background: '#7360F2', color: '#fff', borderRadius: 14 }}><IconViber size={18} />Viber</a>}
      {l.email && <a href={l.email} className="btn btn-outline" style={{ borderRadius: 14 }}><IconMail size={16} />И-мэйл</a>}
    </div>
  );
}

function Chat({ onClose, links }) {
  const [msgs, setMsgs] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const sid = useRef('');
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (saved?.sid) { sid.current = saved.sid; if (saved.msgs?.length) setMsgs(saved.msgs); }
    } catch { /* хоосон */ }
    if (!sid.current) sid.current = (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`).replace(/[^a-zA-Z0-9-]/g, '');
    inputRef.current?.focus();
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [onClose]);

  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify({ sid: sid.current, msgs: msgs.slice(-30) })); } catch { /* ignore */ }
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, busy]);

  const send = async (text) => {
    const t = String(text || '').trim();
    if (!t || busy) return;
    const next = [...msgs, { role: 'user', content: t }];
    setMsgs(next);
    setInput('');
    if (/^оператортой ярих$/i.test(t)) {
      setMsgs([...next, { role: 'assistant', content: 'Тэгье, манай оператортой шууд холбогдоорой.', handoff: true }]);
      return;
    }
    setBusy(true);
    try {
      const history = next.filter((m) => m !== GREETING).slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const { data } = await api('/assistant/chat', { method: 'POST', body: { sessionId: sid.current, messages: history } });
      setMsgs((m) => [...m, { role: 'assistant', content: data.text, cards: data.cards, handoff: data.handoff }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: 'assistant', content: `${e.message}`, handoff: true }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const last = msgs.length - 1;
  return (
    <section className="chatbox" role="dialog" aria-label="Аяллын туслах">
      <header>
        <span className="av"><IconPlane size={20} /></span>
        <span style={{ flex: 1 }}><b style={{ display: 'block', fontSize: 17, fontWeight: 800 }}>Аяллын туслах</b><small className="muted" style={{ fontWeight: 600 }}>Онлайн · хэдхэн секундэд хариулна</small></span>
        <button type="button" className="icon-btn" onClick={() => { setMsgs([GREETING]); }} aria-label="Шинээр эхлэх" title="Шинээр эхлэх" style={{ fontSize: 12, fontWeight: 800, width: 'auto', padding: '0 12px' }}>Шинэ</button>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Хаах"><IconClose size={18} /></button>
      </header>
      <div className="log" ref={logRef} role="log" aria-live="polite">
        {msgs.map((m, k) => m.role === 'user' ? (
          <div key={k} className="msg user">{m.content}</div>
        ) : (
          <div key={k} className="msg bot">
            <div className="bubble">{m.content}</div>
            {m.cards?.map((c) => (
              <Link key={c.slug} href={`/tours/${c.slug}`} className="mini" onClick={onClose}>
                {c.image ? <img src={c.image} alt="" /> : <span className="ph" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><IconImage size={22} /></span>}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b>{c.title}</b>
                  <small>{duration(c.days, c.nights)}{c.nextStart ? ` · ${range(c.nextStart, c.nextEnd, { year: false })}` : ''}</small>
                  {c.minPrice && <span className="pr">{money(c.minPrice)}-с</span>}
                </span>
                <span aria-hidden="true" style={{ color: 'var(--teal)', fontWeight: 800 }}>→</span>
              </Link>
            ))}
            {m.handoff && <ContactButtons l={links} />}
            {k === last && !busy && m.chips?.length > 0 && (
              <div className="stack gap-8" style={{ alignItems: 'flex-start' }}>
                {m.chips.map((c) => <button key={c} type="button" className="qchip" onClick={() => send(c)}>{c}</button>)}
              </div>
            )}
          </div>
        ))}
        {busy && <div className="typing-dots msg" aria-label="Бичиж байна"><span /><span /><span /></div>}
      </div>
      <footer>
        <form className="row gap-8" style={{ flexWrap: 'nowrap' }} onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="chat-in" className="sr-only">Асуултаа бичнэ үү</label>
          <input id="chat-in" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Асуултаа бичнэ үү…" maxLength={1500} autoComplete="off" />
          <button type="submit" className="send" disabled={!input.trim() || busy} aria-label="Илгээх"><IconSend size={20} /></button>
        </form>
        <small className="muted" style={{ textAlign: 'center', fontSize: 12 }}>AI туслах алдаа гаргаж болно · Үнийг аяллын хуудсан дээр баталгаажуулна</small>
      </footer>
    </section>
  );
}

export default function SupportDock() {
  const { settings, assistantEnabled } = useSite();
  const l = contactLinks(settings);
  const [chat, setChat] = useState(false);
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    const t = setTimeout(() => setHint(!sessionStorage.getItem('bb_hint_seen')), 2500);
    return () => { window.removeEventListener('scroll', on); clearTimeout(t); };
  }, []);

  const openChat = () => { setChat(true); setHint(false); try { sessionStorage.setItem('bb_hint_seen', '1'); } catch { /* ignore */ } };

  const items = [
    l.messenger && { href: l.messenger, label: 'Messenger', bg: 'linear-gradient(135deg,#00B2FF,#A033FF)', icon: <IconMessenger size={26} />, ext: true },
    l.viber && { href: l.viber, label: 'Viber', bg: '#7360F2', icon: <IconViber size={26} /> },
    l.phone && { href: l.phone, label: 'Утсаар залгах', bg: 'var(--sky)', icon: <IconPhone size={24} /> },
    l.email && { href: l.email, label: 'И-мэйл бичих', bg: 'var(--ink)', icon: <IconMail size={24} /> },
  ].filter(Boolean);

  if (chat) return <Chat onClose={() => setChat(false)} links={l} />;

  return (
    <div className="fab-wrap">
      {showTop && <button type="button" className="to-top" aria-label="Дээш буцах" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><IconUp size={22} /></button>}
      {assistantEnabled ? (
        <div className="row gap-12" style={{ flexWrap: 'nowrap' }}>
          {hint && <button type="button" className="fab-hint" onClick={openChat}><small>● Аяллын туслах онлайн</small><b>Асуух зүйл байна уу?</b></button>}
          <button type="button" className="fab-main ping" onClick={openChat} aria-label="Аяллын туслах нээх"><IconChat size={28} /></button>
        </div>
      ) : items.length > 0 && (
        <>
          {open && <div className="fab-list" id="fab-list">{items.map((it) => (
            <a key={it.label} href={it.href} aria-label={it.label} title={it.label} style={{ background: it.bg }} {...(it.ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{it.icon}</a>
          ))}</div>}
          <button type="button" className="fab-main" aria-expanded={open} aria-controls="fab-list" aria-label={open ? 'Хаах' : 'Бидэнтэй холбогдох'} onClick={() => setOpen((v) => !v)}>
            <IconPlus size={30} strokeWidth={2.6} style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform .2s' }} />
          </button>
        </>
      )}
    </div>
  );
}
