const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const getUserRole = () => localStorage.getItem('role');
export const getUsername = () => localStorage.getItem('username');

export const setAuthData = (token: string, role: string, username: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  localStorage.setItem('username', username);
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
};

async function readErrorBody(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { error?: string; detail?: string };
    const parts = [j?.error, j?.detail].filter(Boolean);
    if (parts.length) return parts.join(' — ');
  } catch {
    /* ignore */
  }
  return text || res.statusText;
}

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
  };
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(API_URL + endpoint, { headers: getHeaders() });
    if (res.status === 401) {
      const hadSession = !!getAuthToken();
      clearAuthData();
      if (hadSession) window.location.reload();
    }
    if (!res.ok) throw new Error(await readErrorBody(res));
    return res.json();
  },
  post: async (endpoint: string, body: unknown) => {
    const res = await fetch(API_URL + endpoint, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      const hadSession = !!getAuthToken();
      clearAuthData();
      if (hadSession) window.location.reload();
    }
    if (!res.ok) throw new Error(await readErrorBody(res));
    return res.json();
  },
};
