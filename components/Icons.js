const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const I = (paths) => function Icon({ size = 18, ...p }) {
  return <svg {...base} width={size} height={size} {...p}>{paths}</svg>;
};

export const IconWave = I(<><path d="M2 16c2 0 2-1.5 4-1.5S8 16 10 16s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" /><path d="M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" /><circle cx="12" cy="8" r="4" /></>);
export const IconPin = I(<><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>);
export const IconCalendar = I(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>);
export const IconClock = I(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const IconArrowRight = I(<path d="M5 12h14M13 6l6 6-6 6" />);
export const IconChevronLeft = I(<path d="m15 18-6-6 6-6" />);
export const IconChevronRight = I(<path d="m9 18 6-6-6-6" />);
export const IconClose = I(<path d="M18 6 6 18M6 6l12 12" />);
export const IconCheck = I(<path d="M20 6 9 17l-5-5" />);
export const IconSearch = I(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const IconUser = I(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const IconPlane = I(<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />);
export const IconHotel = I(<><path d="M2 20V8M2 14h20v6M22 20v-8a3 3 0 0 0-3-3h-8v5" /><circle cx="6.5" cy="11" r="1.5" /></>);
export const IconGrid = I(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>);
export const IconImage = I(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5L5 20" /></>);
export const IconLock = I(<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>);
export const IconList = I(<path d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01" />);
export const IconLogout = I(<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>);
export const IconHome = I(<><path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>);
export const IconGuide = I(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" /></>);
export const IconPhone = I(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />);
export const IconMail = I(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const IconPlus = I(<path d="M12 5v14M5 12h14" />);
export const IconUp = I(<path d="m18 15-6-6-6 6" />);
export const IconMenu = I(<path d="M4 7h16M8 12h12M4 17h16" />);
export const IconDots = I(<><circle cx="6" cy="6" r="1" /><circle cx="12" cy="6" r="1" /><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="6" cy="18" r="1" /><circle cx="12" cy="18" r="1" /></>);
export const IconFile = I(<><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>);
export const IconSettings = I(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>);
export const IconGift = I(<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></>);

/* Брэндийн дүрс (fill) */
const F = (d, vb = '0 0 24 24') => function Brand({ size = 22 }) {
  return <svg width={size} height={size} viewBox={vb} fill="currentColor" aria-hidden="true"><path d={d} /></svg>;
};
export const IconFacebook = F('M14 8V6.5c0-.7.5-1 1-1h2V2h-3c-3 0-4 2.2-4 4.2V8H8v3.5h2V22h4V11.5h3l.5-3.5z');
export const IconInstagram = F('M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm6-7.9a1.1 1.1 0 1 1-1.1-1.1A1.1 1.1 0 0 1 18 7.1zM21.9 7a5.5 5.5 0 0 0-1.5-3.9A5.5 5.5 0 0 0 16.5 1.6C15 1.5 9 1.5 7.5 1.6a5.5 5.5 0 0 0-3.9 1.5A5.5 5.5 0 0 0 2.1 7C2 8.5 2 15.5 2.1 17a5.5 5.5 0 0 0 1.5 3.9 5.5 5.5 0 0 0 3.9 1.5c1.5.1 7.5.1 9 0a5.5 5.5 0 0 0 3.9-1.5 5.5 5.5 0 0 0 1.5-3.9c.1-1.5.1-8.5 0-10zm-2.3 12.4a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.9.4s-4.7.1-5.9-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.4s-.1-4.2.4-5.4A3 3 0 0 1 6.1 4.9c1.2-.5 4-.4 5.9-.4s4.7-.1 5.9.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.4s.1 4.2-.4 5.4z');
export const IconYoutube = F('M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z');
export const IconMessenger = F('M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.2 7.1v3.3l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.9-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z');
export const IconViber = F('M11.4 1.5c-2 0-6.2.3-8.2 2.2C1.7 5.2 1.2 7.4 1.1 10.1c-.1 2.7-.2 7.8 4.7 9.2v2.1s0 .9.5 1c.7.2 1.1-.4 1.7-1.1l1.1-1.3c3.3.3 5.9-.4 6.2-.5.7-.2 4.4-.7 5-5.7.6-5.2-.3-8.4-2-9.9l-.1-.1c-.5-.5-2.5-2-7-2.2zM12 4c.4 0 3.5.2 5.3 2 1.6 1.4 1.8 4.7 1.4 8.4-.4 3.9-3.2 4.2-3.8 4.4-.2.1-2.5.6-5.2.4l-2.8 3.1V18c-4.1-1.1-3.9-5.4-3.8-7.6.1-2.2.5-4 1.7-5.2C6.4 3.8 10.4 4 12 4zm.2 2.2a.4.4 0 0 0 0 .8 4.7 4.7 0 0 1 4.8 4.8.4.4 0 0 0 .8 0 5.5 5.5 0 0 0-5.6-5.6zm-3.3.8a1 1 0 0 0-.7.2l-.7.6a1.4 1.4 0 0 0-.3 1.6 13 13 0 0 0 2.4 3.7 12.3 12.3 0 0 0 5 3.2 1.4 1.4 0 0 0 1.6-.4l.5-.6a.9.9 0 0 0-.1-1.3l-1.6-1.2a.9.9 0 0 0-1.2.1l-.5.6a.6.6 0 0 1-.7.2 6 6 0 0 1-3.1-3.1.6.6 0 0 1 .2-.7l.6-.5a.9.9 0 0 0 .1-1.2L9.6 7.3a.9.9 0 0 0-.7-.3zm3.5.8a.4.4 0 0 0 0 .8 2.9 2.9 0 0 1 2.9 2.9.4.4 0 0 0 .8 0 3.7 3.7 0 0 0-3.7-3.7zm.2 1.6a.4.4 0 0 0 0 .8 1.2 1.2 0 0 1 1.2 1.2.4.4 0 0 0 .8 0 2 2 0 0 0-2-2z');
export const IconChat = I(<><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></>);
export const IconSend = I(<path d="M12 19V5M5 12l7-7 7 7" />);
export const IconShield = I(<><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>);
export const IconCalc = I(<><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" /></>);
export const IconCompass = I(<><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>);
export const IconClipboard = I(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>);
export const IconChevronDown = I(<path d="m6 9 6 6 6-6" />);
export const IconSort = I(<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" />);
