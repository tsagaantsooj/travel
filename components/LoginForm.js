'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from './AuthProvider';
import Brand from './Brand';

export default function LoginForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const [mode, setMode] = useState(sp.get('mode') === 'register' ? 'register' : 'login');
  const [show, setShow] = useState(false);
  const [f, setF] = useState({ fullName: '', phone: '', email: '', password: '', password2: '', agree: false });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const nextUrl = (() => {
    const n = sp.get('next');
    return n && n.startsWith('/') && !n.startsWith('//') ? n : null;
  })();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (mode === 'register') {
      if (f.password.length < 8) return setErr('Нууц үг хамгийн багадаа 8 тэмдэгт байна');
      if (f.password !== f.password2) return setErr('Нууц үг таарахгүй байна');
      if (!f.agree) return setErr('Үйлчилгээний нөхцөлийг зөвшөөрнө үү');
    }
    setBusy(true);
    try {
      const body = mode === 'login'
        ? { phone: f.phone, password: f.password }
        : { fullName: f.fullName, phone: f.phone, email: f.email, password: f.password };
      await api(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body });
      const me = await refresh();
      router.push(nextUrl || (me?.role === 'admin' ? '/admin' : '/account/bookings'));
      router.refresh();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <div className="auth-wrap">
      <div className="auth-art">
        <div className="inner">
          <Brand light />
          <div className="stack gap-12" style={{ maxWidth: 460 }}>
            <h2 className="serif" style={{ fontWeight: 600, fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', lineHeight: 1.1 }}>Захиалгаа нэг дороос хянаарай</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6 }}>Төлбөрийн төлөв, аялагчдын мэдээлэл, аяллын заавраа хүссэн үедээ харна.</p>
          </div>
        </div>
      </div>
      <div className="auth-form">
        <div>
          <div className="segmented" role="tablist" aria-label="Нэвтрэх эсвэл бүртгүүлэх" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => { setMode('login'); setErr(''); }}>Нэвтрэх</button>
            <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => { setMode('register'); setErr(''); }}>Бүртгүүлэх</button>
          </div>
          <div className="stack gap-4">
            <h1 className="serif" style={{ fontWeight: 600, fontSize: 32 }}>{mode === 'login' ? 'Тавтай морил' : 'Бүртгэл үүсгэх'}</h1>
            <p className="muted">{mode === 'login' ? 'Утасны дугаар, нууц үгээрээ нэвтэрнэ үү.' : 'Бүртгүүлээд захиалгаа онлайнаар хянаарай.'}</p>
          </div>
          <form onSubmit={submit} className="stack gap-16" noValidate>
            {mode === 'register' && (
              <div className="field"><label htmlFor="f-name">Овог нэр</label><input id="f-name" className="input" value={f.fullName} onChange={set('fullName')} autoComplete="name" required /></div>
            )}
            <div className="field"><label htmlFor="f-phone">Утасны дугаар</label><input id="f-phone" className="input" type="tel" inputMode="numeric" value={f.phone} onChange={set('phone')} autoComplete="tel" required /></div>
            {mode === 'register' && (
              <div className="field"><label htmlFor="f-mail">И-мэйл (заавал биш)</label><input id="f-mail" className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" /></div>
            )}
            <div className="field">
              <label htmlFor="f-pass">Нууц үг</label>
              <div style={{ position: 'relative' }}>
                <input id="f-pass" className="input" type={show ? 'text' : 'password'} value={f.password} onChange={set('password')}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={{ paddingRight: 72 }} required />
                <button type="button" className="btn-link" onClick={() => setShow((v) => !v)} aria-label={show ? 'Нууц үгийг нуух' : 'Нууц үгийг харуулах'}
                  style={{ position: 'absolute', right: 14, top: 15, fontSize: 13 }}>{show ? 'Нуух' : 'Харах'}</button>
              </div>
            </div>
            {mode === 'register' && (
              <>
                <div className="field"><label htmlFor="f-pass2">Нууц үг давтах</label><input id="f-pass2" className="input" type="password" value={f.password2} onChange={set('password2')} autoComplete="new-password" /></div>
                <label className="check"><input type="checkbox" checked={f.agree} onChange={set('agree')} />Үйлчилгээний нөхцөл, нууцлалын бодлогыг зөвшөөрч байна</label>
              </>
            )}
            {err && <div className="error-box" role="alert">{err}</div>}
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
              {busy ? 'Түр хүлээнэ үү…' : mode === 'login' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
            </button>
            {mode === 'login' && <p className="muted" style={{ fontSize: 14, textAlign: 'center' }}>Нууц үгээ мартсан бол бидэнтэй холбогдоорой.</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
