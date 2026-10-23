'use client';
import { createContext, useContext } from 'react';

const Ctx = createContext({ settings: {}, promotions: [] });
export function SiteProvider({ value, children }) {
  return <Ctx.Provider value={value || { settings: {}, promotions: [] }}>{children}</Ctx.Provider>;
}
export const useSite = () => useContext(Ctx);
