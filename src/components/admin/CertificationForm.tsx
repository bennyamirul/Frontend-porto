"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminCertification,
  getAdminCertificationById,
  uploadAdminImage,
  updateAdminCertification,
  type CertificationPayload,
} from "@/lib/admin-api";

type CertificationFormProps = {
  mode: "create" | "edit";
  certificationId?: number;
};

type CertificationFormState = CertificationPayload;

const emptyCertificationForm: CertificationFormState = {
  title: "",
  issuer: "",
  issueDate: "",
  credentialUrl: "",
  imageUrl: "",
};

export function CertificationForm({
  mode,
  certificationId,
}: CertificationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CertificationFormState>(
    emptyCertificationForm,
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !certificationId) {
      return;
    }

    const activeCertificationId = certificationId ?? 0;

    async function loadCertification() {
      try {
        const certification = await getAdminCertificationById(
          activeCertificationId,
        );

        if (!certification) {
          setError("Sertifikat tidak ditemukan.");
          return;
        }

        setForm({
          title: certification.title,
          issuer: certification.issuer,
          issueDate: certification.issueDate,
          credentialUrl: certification.credentialUrl,
          imageUrl: certification.imageUrl,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil data sertifikat.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCertification();
  }, [certificationId, mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const imageUrl = imageFile
        ? await uploadAdminImage(imageFile)
        : form.imageUrl;
      const payload = { ...form, imageUrl };

      if (mode === "create") {
        await createAdminCertification(payload);
      } else if (certificationId) {
        await updateAdminCertification(certificationId, payload);
      }

      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan sertifikat.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<Key extends keyof CertificationFormState>(
    key: Key,
    value: CertificationFormState[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  return (
    <AdminShell
      description=""
      title={mode === "create" ? "Tambah Sertifikat" : "Edit Sertifikat"}
    >
      {isLoading ? (
        <p className="text-slate-600">Sedang memuat data sertifikat...</p>
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
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput
              label="Title"
              onChange={(value) => updateField("title", value)}
              required
              value={form.title}
            />
            <AdminInput
              label="Issuer"
              onChange={(value) => updateField("issuer", value)}
              required
              value={form.issuer}
            />
          </div>
          <AdminInput
            label="Issue date"
            onChange={(value) => updateField("issueDate", value)}
            value={form.issueDate}
          />
          <AdminInput
            label="Credential URL"
            onChange={(value) => updateField("credentialUrl", value)}
            value={form.credentialUrl}
          />
          <AdminFileInput
            currentUrl={form.imageUrl}
            label="Issuer logo"
            onChange={setImageFile}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Sertifikat"}
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
  onChange: (value: string) => void;
};

type AdminFileInputProps = {
  label: string;
  currentUrl: string;
  onChange: (file: File | null) => void;
};

function AdminFileInput({ label, currentUrl, onChange }: AdminFileInputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-accent"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        type="file"
      />
      {currentUrl ? (
        // img dipakai untuk menampilkan preview URL gambar yang berasal dari backend.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="Current issuer logo"
          className="h-20 w-20 rounded-xl border border-slate-200 object-contain p-1"
          src={currentUrl}
        />
      ) : null}
    </label>
  );
}

function AdminInput({
  label,
  value,
  required = false,
  onChange,
}: AdminInputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}
