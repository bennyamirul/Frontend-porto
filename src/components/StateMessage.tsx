type StateMessageProps = {
  title: string;
  message: string;
};

/**
 * Menampilkan loading, empty, atau error state dengan visual yang konsisten.
 * Dipakai halaman yang fetch data agar masalah koneksi backend mudah terlihat langsung di browser.
 */
export function StateMessage({ title, message }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <p className="font-medium text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
    </div>
  );
}
