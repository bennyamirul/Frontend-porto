"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { loginAdmin } from "@/lib/admin-api";

/**
 * Menampilkan form login admin dan meminta backend memasang cookie admin_token.
 * Dipakai route /admin/login; cookie httpOnly tidak dibaca langsung oleh React, cukup dikirim otomatis oleh browser.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Mengirim password ke POST /api/admin/login lalu pindah ke dashboard saat sukses.
   * credentials include berada di helper agar cookie dari backend diterima dan tersimpan oleh browser.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await loginAdmin(password);
      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Login gagal.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminShell
      description="Masukkan password admin. Backend akan menyimpan token di cookie httpOnly jika password benar."
      title="Login Admin"
    >
      <form
        className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
        onSubmit={handleSubmit}
      >
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Admin password"
          type="password"
          value={password}
        />
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button
          className="mt-5 w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_14px_28px_rgba(15,118,110,0.15)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Memproses..." : "Login"}
        </button>
      </form>
    </AdminShell>
  );
}
