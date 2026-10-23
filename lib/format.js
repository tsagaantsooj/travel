export function money(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  return `${Math.round(Number(n)).toLocaleString('en-US')}₮`;
}

const pad = (n) => String(n).padStart(2, '0');

export function dot(ymd) {
  if (!ymd) return '';
  const [y, m, d] = ymd.slice(0, 10).split('-');
  return `${y}.${m}.${d}`;
}

/** 2026.11.27 – 12.04 */
export function range(start, end, { year = true } = {}) {
  if (!start) return '';
  const [y1, m1, d1] = start.split('-');
  const [y2, m2, d2] = (end || start).split('-');
  const left = year ? `${y1}.${m1}.${d1}` : `${m1}.${d1}`;
  const right = y1 === y2 || !year ? `${m2}.${d2}` : `${y2}.${m2}.${d2}`;
  return `${left} – ${right}`;
}

const MONTHS = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'];
export const monthLabel = (ymd) => MONTHS[Number(ymd.slice(5, 7)) - 1];
export const dayOf = (ymd) => ymd.slice(8, 10);

export function duration(days, nights) {
  return nights ? `${days} өдөр ${nights} шөнө` : `${days} өдөр`;
}

export const CATEGORY = { abroad: 'Гадаад аялал', domestic: 'Дотоод аялал', day: 'Өдрийн аялал' };
export const PACKAGE = { guided: 'Хөтөлбөртэй', free: 'Чөлөөт' };

export const STATUS = {
  pending: { label: 'Хүсэлт илгээсэн', tone: 'blue' },
  awaiting_payment: { label: 'Төлбөр хүлээгдэж буй', tone: 'orange' },
  confirmed: { label: 'Баталгаажсан', tone: 'teal' },
  paid: { label: 'Төлөгдсөн', tone: 'green' },
  cancelled: { label: 'Цуцлагдсан', tone: 'gray' },
  expired: { label: 'Хугацаа дууссан', tone: 'gray' },
};

export const ADMIN_STATUS = { ...STATUS, pending: { label: 'Шинэ хүсэлт', tone: 'blue' } };

export const PROVIDER = { qpay: 'QPay', transfer: 'Шилжүүлэг', cash: 'Бэлэн', card: 'Карт' };

export function dateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function hotelLabel(name, stars) {
  if (!name) return '';
  return stars ? `${name} ${stars}*` : name;
}
