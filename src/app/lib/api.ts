function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.trim().replace(/\/+$|\s+$/g, "");
}

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export interface RetryOptions {
  retries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  retryStatusCodes?: number[];
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: RetryOptions = {},
): Promise<Response> {
  const retries = options.retries ?? 2;
  const initialDelayMs = options.initialDelayMs ?? 500;
  const backoffFactor = options.backoffFactor ?? 1.8;
  const retryStatusCodes = options.retryStatusCodes ?? [408, 429, 500, 502, 503, 504];

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      const response = await fetch(input, init);
      if (response.ok || !retryStatusCodes.includes(response.status) || attempt === retries) {
        return response;
      }

      lastError = new Error(`Request failed with status ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt === retries) {
      throw lastError instanceof Error ? lastError : new Error("Request failed");
    }

    const delay = initialDelayMs * backoffFactor ** attempt;
    await new Promise((resolve) => window.setTimeout(resolve, delay));
    attempt += 1;
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed");
}

export function buildApiUrl(path: string, envVar?: string) {
  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  const candidates = new Set<string>();

  if (envVar) {
    candidates.add(envVar);
    candidates.add(envVar.replace(/_BASE_URL$/, "_URL"));
    candidates.add(envVar.replace(/_URL$/, "_BASE_URL"));
  }

  candidates.add("VITE_BACKEND_BASE_URL");
  candidates.add("VITE_FORUM_BACKEND_BASE_URL");
  candidates.add("VITE_AI_BACKEND_BASE_URL");
  candidates.add("VITE_FORUM_BACKEND_URL");
  candidates.add("VITE_AI_BACKEND_URL");

  let baseUrl: string | undefined;
  for (const candidate of candidates) {
    const value = env[candidate]?.trim();
    if (value) {
      baseUrl = value;
      break;
    }
  }

  if (!baseUrl) {
    return normalizePath(path);
  }

  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = normalizePath(path);

  if (/\/api(?:\/v1)?$/.test(normalizedBase) && normalizedPath.startsWith("/api")) {
    const trimmedPath = normalizedPath.replace(/^\/api(?:\/v1)?/, "");
    return `${normalizedBase}${trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`}`;
  }

  return `${normalizedBase}${normalizedPath}`;
}
