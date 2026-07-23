const EXPIRY_BUFFER_MS = 5000;

const decodeJwtPayload = (token: string): { exp?: number } | null => {
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;

  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;

  return Date.now() >= payload.exp * 1000 - EXPIRY_BUFFER_MS;
};
