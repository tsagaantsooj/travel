import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SupportDock from '@/components/SupportDock';
import FacebookPixel from '@/components/FacebookPixel';
import { SiteProvider } from '@/components/SiteProvider';
import { apiServer } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const site = await apiServer('/site').catch(() => null);
  const value = site || { settings: {}, promotions: [], assistantEnabled: false };
  return (
    <SiteProvider value={value}>
      <Header />
      <main>{children}</main>
      <Footer />
      <SupportDock />
      <FacebookPixel id={value.settings.fb_pixel_id} />
    </SiteProvider>
  );
}
