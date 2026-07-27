const TOKEN_KEY = 'pbx_token';
const SESSION_KEY = 'pbx_session';

export function getApiOrigin() {
  const configured = process.env.REACT_APP_BACKEND_URL || '';
  return configured.replace(/\/$/, '');
}

export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getApiOrigin()}${normalized}`;
}

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || getStoredSession()?.token || '';
}

export function authHeaders(extraHeaders = {}) {
  const session = getStoredSession();
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers['X-Session-Token'] = token;
  }

  if (session?.activeProfileId) {
    headers['X-Active-Profile'] = session.activeProfileId;
  }

  return headers;
}

export async function apiFetch(path, options = {}) {
  return fetch(apiUrl(path), {
    ...options,
    headers: authHeaders(options.headers || {}),
  });
}

export async function parseApiResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export async function apiJson(path, options = {}) {
  const response = await apiFetch(path, options);
  const data = await parseApiResponse(response);
  if (!response.ok) {
    throw new Error(data.detail || data.error || response.statusText || 'API request failed');
  }
  return data;
}

