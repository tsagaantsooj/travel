'use client';
import Link from 'next/link';
import Brand from './Brand';
import { useSite } from './SiteProvider';
import { contactLinks } from '@/lib/site';
import { IconFacebook, IconInstagram, IconYoutube } from './Icons';

export default function Footer() {
  const { settings: s } = useSite();
  const l = contactLinks(s);
  return (
    <footer className="site-footer" id="contact">
      <div className="inner">
        <div className="stack gap-16" style={{ flex: '1 1 300px', maxWidth: 380 }}>
          <Brand name={s.company_name} />
          <span>{s.tagline || 'Гадаад, дотоод аяллыг хялбар төлөвлөж онлайнаар захиалаарай.'}</span>
          {(l.facebook || l.instagram || l.youtube) && (
            <div className="socials">
              {l.facebook && <a href={l.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook size={20} /></a>}
              {l.instagram && <a href={l.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram size={20} /></a>}
              {l.youtube && <a href={l.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYoutube size={20} /></a>}
            </div>
          )}
        </div>
        <div className="stack gap-8"><strong>Аялал</strong>
          <Link href="/tours?category=abroad">Гадаад аялал</Link><Link href="/tours?category=domestic">Дотоод аялал</Link><Link href="/#custom">Захиалгат аялал</Link></div>
        <div className="stack gap-8"><strong>Тусламж</strong>
          <Link href="/account/bookings">Миний захиалгууд</Link><Link href="/terms">Аяллын нөхцөл</Link>{l.map && <a href={l.map} target="_blank" rel="noopener noreferrer">Газрын зураг</a>}</div>
        <div className="stack gap-8" style={{ maxWidth: 280 }}><strong>Холбоо барих</strong>
          {s.phone && <a href={l.phone}>{s.phone}{s.phone2 ? `, ${s.phone2}` : ''}</a>}
          {s.email && <a href={l.email}>{s.email}</a>}
          {s.address && <span style={{ whiteSpace: 'pre-line' }}>{s.address}</span>}</div>
      </div>
      <div className="copy">© {new Date().getFullYear()} {s.company_name || 'Batbileg Travel'}. Бүх эрх хуулиар хамгаалагдсан.</div>
    </footer>
  );
}
