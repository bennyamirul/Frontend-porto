"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getAdminProfile,
  updateAdminProfile,
  uploadAdminImage,
  type ProfilePayload,
} from "@/lib/admin-api";

const emptyProfileForm: ProfilePayload = {
  name: "",
  email: "",
  avatarUrl: "",
};

export function ProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<ProfilePayload>(emptyProfileForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getAdminProfile();

        setForm({
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil data profil.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const avatarUrl = imageFile
        ? await uploadAdminImage(imageFile)
        : form.avatarUrl;

      await updateAdminProfile({ ...form, avatarUrl });
      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan profil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<Key extends keyof ProfilePayload>(
    key: Key,
    value: ProfilePayload[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  const profileName = form.name ?? "";
  const profileEmail = form.email ?? "";

  return (
    <AdminShell description="" title="Edit Profile">
      {isLoading ? (
        <p className="text-slate-600">Sedang memuat data profil...</p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-2xl border border-red-200 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {!isLoading ? (
        <form
          className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:flex-row">
            {form.avatarUrl ? (
              <img
                alt={profileName || "Profile avatar"}
                className="h-24 w-24 rounded-full object-cover"
                src={form.avatarUrl}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
                {profileName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "NA"}
              </div>
            )}
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-slate-500">Preview</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {profileName || "Nama belum diisi"}
              </p>
              <p className="text-sm text-slate-600">
                {profileEmail || "Email belum diisi"}
              </p>
            </div>
          </div>

          <AdminInput
            label="Nama"
            onChange={(value) => updateField("name", value)}
            required
            value={form.name}
          />
          <AdminInput
            label="Email"
            onChange={(value) => updateField("email", value)}
            required
            type="email"
            value={form.email}
          />
          <div className="grid gap-3">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Foto Profil
              <input
                accept="image/*"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-accent-foreground hover:file:bg-[#0d6d64]"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
                type="file"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
            </button>
            <button
              className="rounded-full border border-slate-200 bg-transparent px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
              onClick={() => router.push("/admin")}
              type="button"
            >
              Batal
            </button>
          </div>
        </form>
      ) : null}
    </AdminShell>
  );
}

type AdminInputProps = {
  label: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  type?: "text" | "email";
  onChange: (value: string) => void;
};

function AdminInput({
  label,
  value,
  required = false,
  placeholder,
  type = "text",
  onChange,
}: AdminInputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
