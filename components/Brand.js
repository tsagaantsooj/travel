import Link from 'next/link';
import { IconPlane } from './Icons';

export default function Brand({ name = 'Batbileg Travel', sub }) {
  const [first, ...rest] = String(name || 'Batbileg Travel').split(' ');
  return (
    <Link href="/" className="brand">
      <span className="brand-mark"><IconPlane size={20} /></span>
      <span>
        <span className="brand-name">{first}{rest.length > 0 && <em> {rest.join(' ').toLowerCase()}</em>}</span>
        {sub && <span className="brand-sub">{sub}</span>}
      </span>
    </Link>
  );
}
