/** Backend-ийн services/pricing.js-тэй ижил дүрэм (зөвхөн харуулахад) */
export function calcQuote({ adult, child, infant, singleSupplement }, { adults, children, infants, singleRoom }) {
  const childAsAdult = adults === 1 && children === 1;
  const childUnit = childAsAdult ? adult : child;
  const lines = [{ key: 'adult', label: `Том хүн × ${adults}`, amount: adults * adult }];
  if (children > 0) lines.push({ key: 'child', label: `Хүүхэд × ${children}`, amount: children * childUnit });
  if (infants > 0) lines.push({ key: 'infant', label: `Нярай × ${infants}`, amount: infants * infant });
  if (singleRoom && singleSupplement > 0) lines.push({ key: 'single', label: 'Ганцаараа өрөөнд', amount: singleSupplement });
  return { childAsAdult, childUnit, lines, total: lines.reduce((s, l) => s + l.amount, 0) };
}
