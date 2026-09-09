"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certificates", label: "Certificates" },
  { href: "/contact", label: "Contact" },
];

/**
 * Menampilkan navigasi global untuk semua halaman.
 * Dipakai di RootLayout supaya setiap route App Router memiliki akses cepat ke bagian portfolio utama.
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed left-4 right-4 top-4 z-50 rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-soft backdrop-blur-md md:left-1/2 md:right-auto md:w-[min(72rem,calc(100%-2rem))] md:-translate-x-1/2 md:rounded-full">
      {/* Background yang terang tapi tetap punya kedalaman: layer putih dengan border tipis dan shadow lembut. */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
        <Link
          className="font-mono text-sm font-semibold uppercase tracking-[0.24em] text-slate-900"
          href="/"
        >
          Benny.dev
        </Link>
        <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm transition ${
                pathname === item.href
                  ? "bg-accent-muted text-accent"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_28px_rgba(15,118,110,0.18)] transition hover:bg-[#0d6d64]"
          href="/contact"
        >
          Hire me
        </Link>
      </nav>
      <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-4 md:hidden">
        {navItems.map((item) => (
          <Link
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${
              pathname === item.href
                ? "border-accent/30 bg-accent-muted text-accent"
                : "border-slate-200 text-slate-600"
            }`}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
