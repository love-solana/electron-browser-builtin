const ALLOWED_SCHEME = /^(https?|about|file|view-source):/i
const HOST_LIKE = /^(localhost|\d{1,3}(\.\d{1,3}){3}|\[[\da-f:]+\])(:\d+)?([/?#].*)?$/i
const DOMAIN_LIKE = /^[^\s/?#:]+\.[a-z]{2,}(:\d+)?([/?#].*)?$/i

export const SEARCH_URL = 'https://www.google.com/search?q='

export function toNavigableUrl(input: string): string | null {
  const text = input.trim()
  if (!text) return null
  if (/\s/.test(text)) return SEARCH_URL + encodeURIComponent(text)
  if (ALLOWED_SCHEME.test(text)) return text
  if (HOST_LIKE.test(text)) return `http://${text}`
  if (DOMAIN_LIKE.test(text)) return `https://${text}`
  return SEARCH_URL + encodeURIComponent(text)
}
