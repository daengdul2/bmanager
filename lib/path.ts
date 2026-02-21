const ROOT = "/sdcard/Download";

export function joinPath(base: string, name: string) {
  const safBase = base || ROOT; // ← pakai ROOT jika base kosong
  return `${safBase.replace(/\/$/, "")}/${name}`;
}