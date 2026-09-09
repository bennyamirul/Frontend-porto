import Link from "next/link";

/**
 * Menampilkan footer global berisi ringkasan identitas dan link navigasi kecil.
 * Dipakai di RootLayout agar halaman tetap terasa selesai tanpa mengulang markup footer di tiap page.
 */
export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/80">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 py-8 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Building clean interfaces, pragmatic systems, and useful developer
          experiences.
        </p>
        <div className="flex gap-4">
          <Link className="transition hover:text-black" href="/projects">
            Work
          </Link>
          <Link className="transition hover:text-black" href="/experience">
            Experience
          </Link>
          <Link className="transition hover:text-black" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
