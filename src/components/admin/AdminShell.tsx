import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

/**
 * Memberi bingkai layout konsisten untuk halaman admin.
 * Dipakai login, dashboard, dan form admin supaya dark theme serta jarak kontennya seragam tanpa mengubah halaman publik.
 */
export function AdminShell({
  title,
  description,
  action,
  children,
}: AdminShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            className="font-mono text-sm text-accent hover:text-[#0d6d64]"
            href="/admin"
          >
            Admin Panel
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            {description}
          </p>
        </div>
        {action}
      </div>
      <div className="mt-8">{children}</div>
    </section>
  );
}
