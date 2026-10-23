'use client';
import { useEffect } from 'react';

export default function PrintButton({ auto = false }) {
  useEffect(() => {
    if (!auto) return undefined;
    // Зургууд ачаалагдах хүртэл бага зэрэг хүлээгээд хэвлэх цонх нээнэ
    const t = setTimeout(() => window.print(), 900);
    return () => clearTimeout(t);
  }, [auto]);
  return (
    <div className="no-print" style={{ position: 'sticky', top: 0, zIndex: 5, background: '#1E2F55', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 700 }}>Хэвлэх цонхноос "Save as PDF" / "PDF хэлбэрээр хадгалах"-ыг сонгоно уу.</span>
      <button type="button" onClick={() => window.print()} style={{ minHeight: 44, padding: '0 22px', border: 0, borderRadius: 10, background: '#FFD36B', color: '#1E2F55', fontWeight: 800, cursor: 'pointer' }}>PDF татах / Хэвлэх</button>
    </div>
  );
}
