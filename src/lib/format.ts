/**
 * Memformat tanggal ISO dari backend menjadi label bulan dan tahun.
 * Dipakai timeline experience supaya nilai time.Time dari Go lebih nyaman dibaca di portfolio.
 */
export function formatMonthYear(value: string | null) {
  if (!value) {
    return "Present";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}
