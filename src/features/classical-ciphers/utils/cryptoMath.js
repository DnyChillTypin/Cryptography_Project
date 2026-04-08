export const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const mod = (n, m) => ((n % m) + m) % m;
export const charIdx = (c) => A.indexOf(c.toUpperCase());

export function sanitize(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}
