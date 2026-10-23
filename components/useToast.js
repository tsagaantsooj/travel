'use client';
import { useCallback, useState } from 'react';

export function useToast() {
  const [t, setT] = useState(null);
  const show = useCallback((msg, err = false) => {
    setT({ msg, err, id: Date.now() });
    setTimeout(() => setT((cur) => (cur && Date.now() - cur.id >= 3400 ? null : cur)), 3500);
  }, []);
  const node = t ? <div className={`toast${t.err ? ' err' : ''}`} role="status">{t.msg}</div> : null;
  return [show, node];
}
