import { apiServer } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Аяллын нөхцөл' };

export default async function TermsPage() {
  const site = await apiServer('/site').catch(() => null);
  const text = site?.settings?.terms_text;
  return (
    <div className="page">
      <div className="container stack gap-24" style={{ maxWidth: 820 }}>
        <h1 className="title-xl">Аяллын нөхцөл, цуцлалтын журам</h1>
        {text ? <div style={{ whiteSpace: 'pre-line', lineHeight: 1.75, fontSize: 16 }}>{text}</div>
          : <p className="muted">Нөхцөлийг удахгүй нийтэлнэ. Асуух зүйл байвал бидэнтэй холбогдоно уу.</p>}
      </div>
    </div>
  );
}
