const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '')
  ?? 'https://waga-2h0w.onrender.com/api/v1'

export function apiBaseUrl(): string {
  return API_URL
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text.slice(0, 200)}`)
  }
  return response.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text.slice(0, 200)}`)
  }
  return response.json() as Promise<T>
}

/** Frontend UI id → backend commodity code */
export function toApiCommodity(id: string): string {
  if (id === 'teff') return 'teff_mixed'
  if (id === 'cookingoil') return 'cooking_oil'
  return id
}

/** Frontend UI id → backend market code */
export function toApiMarket(id: string): string {
  const map: Record<string, string> = {
    'ehil-berenda': 'ehil_berenda',
    'atikilt-tera': 'atikilt_tera',
    piassa: 'piazza',
  }
  return map[id] ?? id
}

export function fromApiCommodity(code: string): string {
  if (code === 'teff_mixed') return 'teff'
  if (code === 'cooking_oil') return 'cookingoil'
  return code
}

export function fromApiMarket(code: string): string {
  const map: Record<string, string> = {
    ehil_berenda: 'ehil-berenda',
    atikilt_tera: 'atikilt-tera',
    piazza: 'piassa',
  }
  return map[code] ?? code
}
