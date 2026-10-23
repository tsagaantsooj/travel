/** Админаас бүртгэсэн тохиргооноос холбоосууд гаргана */
export function contactLinks(s = {}) {
  const digits = (v) => String(v || '').replace(/[^\d+]/g, '');
  const viber = digits(s.viber_phone);
  return {
    phone: s.phone ? `tel:${digits(s.phone)}` : null,
    email: s.email ? `mailto:${s.email}` : null,
    messenger: s.messenger_user ? `https://m.me/${s.messenger_user.replace(/^@/, '')}` : null,
    viber: viber ? `viber://chat?number=${encodeURIComponent(viber.startsWith('+') ? viber : `+976${viber}`)}` : null,
    facebook: s.facebook_url || null,
    instagram: s.instagram_url || null,
    youtube: s.youtube_url || null,
    map: s.map_url || null,
  };
}

/** Facebook Pixel event (pixel тохируулаагүй бол юу ч хийхгүй) */
export function track(event, params) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') window.fbq('track', event, params);
}
