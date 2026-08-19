export class ApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// Environment variable ho to woh uthayega, warna relative path use karega
const BASE_URL = import.meta.env.VITE_API_URL || "";

let isRefreshing = false;
let refreshPromise = null;

async function attemptRefresh() {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiClient(path, { body, headers, method = "GET", signal, _retry = false } = {}) {
  const endpoint = path.startsWith("/api/v1") ? path : `/api/v1${path}`;
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    signal,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  // Handle 401 token refresh retry (avoid loop on auth endpoints)
  if (
    response.status === 401 &&
    !_retry &&
    !path.includes("/auth/refresh") &&
    !path.includes("/auth/login") &&
    !path.includes("/auth/signup")
  ) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiClient(path, { body, headers, method, signal, _retry: true });
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.error?.message || "We could not complete that request.", {
      status: response.status,
      code: payload?.error?.code || "REQUEST_FAILED",
      data: payload?.data,
    });
  }

  return payload?.data ?? payload;
}