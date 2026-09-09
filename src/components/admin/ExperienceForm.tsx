"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminExperience,
  getAdminExperienceById,
  uploadAdminImage,
  updateAdminExperience,
  type ExperiencePayload,
} from "@/lib/admin-api";

type ExperienceFormProps = {
  mode: "create" | "edit";
  experienceId?: number;
};

type ExperienceFormState = {
  company: string;
  imageUrl: string;
  location: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

const emptyExperienceForm: ExperienceFormState = {
  company: "",
  imageUrl: "",
  location: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
};

/**
 * Mengubah ISO datetime dari backend menjadi value input date HTML.
 * Dipakai saat prefill form edit karena input type date hanya menerima format yyyy-mm-dd.
 */
function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

/**
 * Mengubah value input date menjadi ISO string untuk Go time.Time.
 * Dipakai sebelum submit karena backend membaca startDate/endDate sebagai time.Time, bukan string bebas.
 */
function toApiDate(value: string) {
  return value ? `${value}T00:00:00Z` : "";
}

/**
 * Mengubah state form experience menjadi payload API.
 * Dipakai submit create/edit supaya EndDate kosong terkirim sebagai null sesuai pointer *time.Time di backend.
 */
function toExperiencePayload(form: ExperienceFormState): ExperiencePayload {
  return {
    company: form.company,
    imageUrl: form.imageUrl,
    location: form.location,
    role: form.role,
    startDate: toApiDate(form.startDate),
    endDate: form.endDate ? toApiDate(form.endDate) : null,
    description: form.description,
  };
}

/**
 * Menampilkan form create/edit experience admin.
 * Dipakai route /admin/experience/new dan /admin/experience/[id]/edit untuk mengelola timeline pengalaman.
 */
export function ExperienceForm({ mode, experienceId }: ExperienceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ExperienceFormState>(emptyExperienceForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !experienceId) {
      return;
    }

    const activeExperienceId = experienceId;

    /**
     * Memuat experience existing untuk prefill form edit.
     * Data awal diambil dari endpoint publik karena backend belum menyediakan GET admin by ID.
     */
    async function loadExperience() {
      try {
        const experience = await getAdminExperienceById(activeExperienceId);

        if (!experience) {
          setError("Experience tidak ditemukan.");
          return;
        }

        setForm({
          company: experience.company,
          imageUrl: experience.imageUrl,
          location: experience.location,
          role: experience.role,
          startDate: toDateInputValue(experience.startDate),
          endDate: toDateInputValue(experience.endDate),
          description: experience.description,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil data experience.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadExperience();
  }, [mode, experienceId]);

  /**
   * Mengirim form experience ke endpoint create atau update sesuai mode.
   * Setelah sukses user kembali ke dashboard supaya perubahan langsung terlihat pada list.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = toExperiencePayload(form);
      const imageUrl = imageFile
        ? await uploadAdminImage(imageFile)
        : payload.imageUrl;

      if (mode === "create") {
        await createAdminExperience({ ...payload, imageUrl });
      } else if (experienceId) {
        await updateAdminExperience(experienceId, { ...payload, imageUrl });
      }

      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan experience.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Memperbarui satu field form experience secara reusable.
   * Dipakai semua input agar state update tetap pendek dan tidak berulang.
   */
  function updateField<Key extends keyof ExperienceFormState>(
    key: Key,
    value: ExperienceFormState[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  return (
    <AdminShell
      description=""
      title={mode === "create" ? "Tambah Experience" : "Edit Experience"}
    >
      {isLoading ? (
        <p className="text-slate-600">Sedang memuat data experience...</p>
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
              label="Company"
              onChange={(value) => updateField("company", value)}
              required
              value={form.company}
            />
            <AdminInput
              label="Location"
              onChange={(value) => updateField("location", value)}
              value={form.location}
            />
          </div>
          <AdminFileInput
            currentUrl={form.imageUrl}
            label="Institution photo"
            onChange={setImageFile}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <AdminInput
              label="Role"
              onChange={(value) => updateField("role", value)}
              required
              value={form.role}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminDateInput
              label="StartDate"
              onChange={(value) => updateField("startDate", value)}
              required
              value={form.startDate}
            />
            <AdminDateInput
              label="EndDate"
              onChange={(value) => updateField("endDate", value)}
              value={form.endDate}
            />
          </div>
          <AdminTextarea
            label="Description"
            onChange={(value) => updateField("description", value)}
            required
            rows={7}
            value={form.description}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Experience"}
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
          alt="Current institution photo"
          className="h-20 w-32 rounded-xl border border-slate-200 object-cover"
          src={currentUrl}
        />
      ) : null}
    </label>
  );
}

/**
 * Merender input teks standar untuk form experience.
 * Dipakai ExperienceForm agar field Company dan Role punya gaya yang sama.
 */
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

/**
 * Merender input tanggal standar untuk StartDate dan EndDate.
 * Dipakai ExperienceForm karena backend membutuhkan tanggal yang akhirnya dikirim sebagai ISO string.
 */
function AdminDateInput({
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
        type="date"
        value={value}
      />
    </label>
  );
}

type AdminTextareaProps = AdminInputProps & {
  rows: number;
};

/**
 * Merender textarea standar untuk deskripsi experience.
 * Dipakai ExperienceForm agar teks panjang nyaman diedit di dashboard.
 */
function AdminTextarea({
  label,
  value,
  required = false,
  rows,
  onChange,
}: AdminTextareaProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <textarea
        className="resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        value={value}
      />
    </label>
  );
}
