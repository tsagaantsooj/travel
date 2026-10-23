'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconSearch } from './Icons';

function nextMonths(n = 8) {
  const out = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    out.push({ value: `${y}-${String(m).padStart(2, '0')}`, label: `${y} оны ${m}-р сар` });
    d.setMonth(d.getMonth() + 1);
  }
  return out;
}

export default function SearchBar({ countries = [], initial = {}, floating = true }) {
  const router = useRouter();
  const [country, setCountry] = useState(initial.country || '');
  const [month, setMonth] = useState(initial.month || '');
  const [category, setCategory] = useState(initial.category || '');

  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (country) q.set('country', country);
    if (month) q.set('month', month);
    if (category) q.set('category', category);
    router.push(`/tours${q.toString() ? `?${q}` : ''}`);
  };

  const form = (
    <form onSubmit={submit} role="search" aria-label="Аялал хайх">
      <div className="field">
        <label htmlFor="s-country">Чиглэл</label>
        <select id="s-country" className="select" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Бүх чиглэл</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="s-month">Гарах сар</label>
        <select id="s-month" className="select" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">Хамаагүй</option>
          {nextMonths().map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="s-cat">Ангилал</label>
        <select id="s-cat" className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Бүгд</option>
          <option value="abroad">Гадаад аялал</option>
          <option value="domestic">Дотоод аялал</option>
          <option value="day">Өдрийн аялал</option>
        </select>
      </div>
      <button type="submit" className="btn btn-accent"><IconSearch /> Аялал хайх</button>
    </form>
  );

  return floating ? <div className="search-card">{form}</div> : <div className="search-card" style={{ margin: 0, padding: 0 }}>{form}</div>;
}
