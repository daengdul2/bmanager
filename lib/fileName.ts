export function shortenFileName(
  name: string,
  maxLength = 12
): string {
  if (name.length <= maxLength) return name;

  const dot = name.lastIndexOf('.');

  // Tidak ada titik atau titik di awal (hidden file)
  if (dot <= 0) {
    return name.slice(0, maxLength - 1) + '..';
  }

  const ext = name.slice(dot);      // ambil dari titik terakhir hingga akhir
  const base = name.slice(0, dot);  // ambil nama sebelum titik terakhir

  const keep = maxLength - ext.length - 1;
  if (keep <= 0) return '..' + ext;

  return base.slice(0, keep) + '..' + ext;
}