export function isSafePath(p: string): boolean {
  return !p.includes('..');
}