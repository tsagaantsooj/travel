'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import Brand from './Brand';
import { useAuth } from './AuthProvider';
import { useSite } from './SiteProvider';
import { contactLinks } from '@/lib/site';
import { IconPhone, IconMenu, IconClose } from './Icons';

const LINKS = [
  { href: '/tours', label: 'Бүх аялал', match: (p, c) => p === '/tours' && !c },
  { href: '/tours?category=abroad', label: 'Гадаад', match: (p, c) => p === '/tours' && c === 'abroad' },
  { href: '/tours?category=domestic', label: 'Дотоод', match: (p, c) => p === '/tours' && c === 'domestic' },
  { href: '/#custom', label: 'Захиалгат аялал', match: () => false },
  { href: '/#offers', label: 'Урамшуулал', match: () => false },
];

function Nav({ open, onPick }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const cat = sp.get('category');
  return (
    <nav className={`nav${open ? ' open' : ''}`} aria-label="Үндсэн цэс">
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} onClick={onPick} aria-current={l.match(pathname, cat) ? 'page' : undefined}>{l.label}</Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { settings } = useSite();
  const links = contactLinks(settings);
  const [menu, setMenu] = useState(false);
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false); };
    document.addEventListener('click', close);
    return () => { window.removeEventListener('scroll', on); document.removeEventListener('click', close); };
  }, []);
  useEffect(() => { setMenu(false); setNav(false); }, [pathname]);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="inner" style={{ position: 'relative' }}>
        <Brand name={settings.company_name} />
        <Suspense fallback={<nav className="nav" />}><Nav open={nav} onPick={() => setNav(false)} /></Suspense>
        <div className="head-right">
          {settings.phone && (
            <a className="phone-pill" href={links.phone}>
              <span className="ic"><IconPhone size={16} /></span>
              <span><small>Захиалга</small><b>{settings.phone}</b></span>
            </a>
          )}
          {loading ? <span style={{ width: 44 }} /> : user ? (
            <div className="user-menu" ref={ref}>
              <button type="button" className="avatar" style={{ border: 0, cursor: 'pointer' }} onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label="Миний бүртгэл">
                {user.fullName?.[0] || 'Б'}
              </button>
              {menu && (
                <div className="menu" role="menu">
                  <span style={{ padding: '8px 12px', fontWeight: 800 }}>{user.fullName}</span>
                  <Link href="/account/bookings" role="menuitem">Миний захиалгууд</Link>
                  {user.role === 'admin' && <Link href="/admin" role="menuitem">Админ</Link>}
                  <button type="button" role="menuitem" onClick={async () => { await logout(); router.push('/'); router.refresh(); }}>Гарах</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href={`/login?next=${encodeURIComponent(pathname || '/')}`} className="link-btn hide-sm">Нэвтрэх</Link>
              <Link href={`/login?mode=register&next=${encodeURIComponent(pathname || '/')}`} className="pill-dark">Бүртгүүлэх</Link>
            </>
          )}
          <button type="button" className="icon-btn menu-toggle" onClick={() => setNav((v) => !v)} aria-expanded={nav} aria-label="Цэс">
            {nav ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
