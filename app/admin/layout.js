'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Brand from '@/components/Brand';
import { IconList, IconPin, IconHome, IconLogout, IconGift, IconSettings, IconChat, IconClipboard } from '@/components/Icons';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) return <div style={{ padding: 40 }}><div className="spinner" /></div>;
  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="stack gap-16" style={{ alignItems: 'center', textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: 32 }}>Админ эрх шаардлагатай</h1>
          <p className="muted">Админ эрхтэй бүртгэлээр нэвтэрнэ үү.</p>
          <Link href="/login?next=/admin" className="btn btn-primary">Нэвтрэх</Link>
        </div>
      </div>
    );
  }

  const nav = [
    { href: '/admin/bookings', label: 'Захиалгууд', icon: IconList },
    { href: '/admin/tours', label: 'Аяллууд', icon: IconPin },
    { href: '/admin/leads', label: 'Захиалгат хүсэлт', icon: IconClipboard },
    { href: '/admin/promotions', label: 'Урамшуулал', icon: IconGift },
    { href: '/admin/assistant', label: 'AI туслах', icon: IconChat },
    { href: '/admin/settings', label: 'Сайтын тохиргоо', icon: IconSettings },
  ];

  return (
    <div className="admin">
      <nav className="admin-side" aria-label="Админ цэс">
        <div style={{ padding: '4px 4px 20px' }}><Brand light sub="админ" /></div>
        {nav.map(({ href, label, icon: Ic }) => (
          <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}><Ic />{label}</Link>
        ))}
        <div style={{ flex: 1 }} />
        <Link href="/"><IconHome />Сайт руу</Link>
        <button type="button" onClick={async () => { await logout(); router.push('/login'); }}><IconLogout />Гарах</button>
      </nav>
      <div className="admin-main">{children}</div>
    </div>
  );
}
