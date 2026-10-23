export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/** Server component-оос backend руу шууд хандана */
export async function apiServer(path, { revalidate = 0 } = {}) {
  const base = process.env.API_URL || 'http://localhost:4000';
  const res = await fetch(`${base}/api${path}`, revalidate ? { next: { revalidate } } : { cache: 'no-store' });
  if (res.status === 404) return null;
  const j = await res.json().catch(() => null);
  if (!res.ok || !j?.success) throw new ApiError(j?.message || `API алдаа (${res.status})`, res.status);
  return j.data;
}

/** Browser талаас (Next rewrite-ээр дамжина) */
export async function api(path, { method = 'GET', body, form } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers: form ? undefined : { 'Content-Type': 'application/json' },
    body: form || (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const j = await res.json().catch(() => null);
  if (!res.ok || !j?.success) {
    throw new ApiError(j?.message || 'Сервертэй холбогдож чадсангүй', res.status, j?.errors);
  }
  return { data: j.data, message: j.message };
}
