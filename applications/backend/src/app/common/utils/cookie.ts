export function parseCookie(cookie: string): Record<string, any> {
  const cookiePairs = cookie.split(';');
  const obj: Record<string, any> = {};
  cookiePairs.forEach((pair) => {
    const [name, value] = pair.split('=');
    if (!name) return;
    const mustBeTrue = value === '';
    obj[name.trim()] = mustBeTrue ? true : value;
  });
  return obj;
}

export function buildCookie(obj: Record<string, any>): string {
  let cookie = '';
  for (const [name, value] of Object.entries(obj)) {
    const isTrue = typeof value === 'boolean' && value;
    const isFalse = typeof value === 'boolean' && !value;

    if (isFalse) continue;
    if (cookie) cookie += '; ';

    if (isTrue) {
      cookie += name;
    } else {
      cookie += `${name}=${value}`;
    }
  }
  return cookie;
}
