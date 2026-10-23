import { IconShield, IconCalc, IconCompass, IconClipboard } from './Icons';

const ITEMS = [
  [IconShield, 'QPay-ээр аюулгүй төлбөр', 'Банкны апп эсвэл QR-аар'],
  [IconCalc, 'Үнэ шууд тооцоологдоно', 'Буудал, багц, хүний тоогоор'],
  [IconCompass, 'Мэргэжлийн монгол хөтөч', 'Аяллын турш хамт'],
  [IconClipboard, 'Захиалгаа онлайнаар хян', 'Төлбөр, аялагчдын мэдээлэл'],
];

export default function TrustStrip() {
  return (
    <div style={{ padding: '0 24px' }}>
      <div className="trust">
        {ITEMS.map(([Ic, t, s]) => (
          <div key={t}><span className="ic"><Ic size={22} /></span><span><b>{t}</b><span>{s}</span></span></div>
        ))}
      </div>
    </div>
  );
}
