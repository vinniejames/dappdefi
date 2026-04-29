// Append `utm_source=dappdefi.com` to an outbound URL so partner sites
// can attribute traffic back to this directory. Handles URLs that already
// have a query string. Returns the original input unchanged if it isn't
// a valid http(s) URL (e.g. mailto:, fragments).
const UTM_SOURCE = 'dappdefi.com';

export function withUtm(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return url;
    u.searchParams.set('utm_source', UTM_SOURCE);
    return u.toString();
  } catch {
    return url;
  }
}
