import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="stack gap-16" style={{ alignItems: 'center', textAlign: 'center' }}>
        <h1 className="title-xl">Хуудас олдсонгүй</h1>
        <p className="muted">Хаяг буруу эсвэл аялал нийтлэгдээгүй байж магадгүй.</p>
        <Link href="/" className="btn btn-primary">Нүүр хуудас</Link>
      </div>
    </div>
  );
}
