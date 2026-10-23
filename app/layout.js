import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata = {
  title: { default: 'Batbileg — аяллын хөтөлбөрүүд', template: '%s · Batbileg' },
  description: 'Гадаад, дотоод аяллын хөтөлбөр, хуваарь, үнийг нэг дороос харж онлайнаар захиална.',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#1E2F55' };

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
