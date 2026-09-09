"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminProject,
  getAdminProjectById,
  uploadAdminImage,
  updateAdminProject,
  type ProjectPayload,
} from "@/lib/admin-api";

type ProjectFormProps = {
  mode: "create" | "edit";
  projectId?: number;
};

const emptyProjectForm: ProjectPayload = {
  title: "",
  slug: "",
  description: "",
  content: "",
  techStack: "",
  imageUrl: "",
  repoUrl: "",
  demoUrl: "",
  featured: false,
};

/**
 * Mengubah array techStack dari helper publik menjadi string yang bisa diedit di textarea.
 * Dipakai saat prefill form edit karena backend admin menerima TechStack sebagai satu string.
 */
function formatTechStackInput(techStack: string[]) {
  return techStack.join(", ");
}

/**
 * Menampilkan form create/edit project admin.
 * Dipakai route /admin/projects/new dan /admin/projects/[id]/edit untuk mengirim payload ke endpoint admin.
 */
export function ProjectForm({ mode, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectPayload>(emptyProjectForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !projectId) {
      return;
    }

    const activeProjectId = projectId;

    /**
     * Memuat project existing untuk mengisi form edit.
     * Data awal diambil dari endpoint publik karena backend belum menyediakan GET admin by ID.
     */
    async function loadProject() {
      try {
        const project = await getAdminProjectById(activeProjectId);

        if (!project) {
          setError("Project tidak ditemukan.");
          return;
        }

        setForm({
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          techStack: formatTechStackInput(project.techStack),
          imageUrl: project.imageUrl,
          repoUrl: project.repoUrl,
          demoUrl: project.demoUrl,
          featured: project.featured,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil data project.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [mode, projectId]);

  /**
   * Mengirim form project ke endpoint create atau update sesuai mode.
   * Setelah sukses user dikembalikan ke dashboard agar daftar terbaru bisa terlihat.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const imageUrl = imageFile
        ? await uploadAdminImage(imageFile)
        : form.imageUrl;

      if (mode === "create") {
        await createAdminProject({ ...form, imageUrl });
      } else if (projectId) {
        await updateAdminProject(projectId, { ...form, imageUrl });
      }

      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan project.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * Memperbarui satu field form tanpa membuat handler berbeda untuk setiap input.
   * Dipakai semua input teks agar state form tetap ringkas dan mudah diikuti.
   */
  function updateField<Key extends keyof ProjectPayload>(
    key: Key,
    value: ProjectPayload[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  return (
    <AdminShell
      description=""
      title={mode === "create" ? "Tambah Project" : "Edit Project"}
    >
      {isLoading ? (
        <p className="text-slate-600">Sedang memuat data project...</p>
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
          <AdminInput
            label="Title"
            onChange={(value) => updateField("title", value)}
            required
            value={form.title}
          />
          <AdminInput
            label="Slug"
            onChange={(value) => updateField("slug", value)}
            required
            value={form.slug}
          />
          <AdminTextarea
            label="Description"
            onChange={(value) => updateField("description", value)}
            required
            rows={3}
            value={form.description}
          />
          <AdminTextarea
            label="Content"
            onChange={(value) => updateField("content", value)}
            required
            rows={8}
            value={form.content}
          />
          <AdminTextarea
            label="TechStack"
            onChange={(value) => updateField("techStack", value)}
            required
            rows={3}
            value={form.techStack}
          />
          <div className="grid gap-5 md:grid-cols-3">
            <AdminFileInput
              currentUrl={form.imageUrl}
              label="Project photo"
              onChange={setImageFile}
            />
            <AdminInput
              label="RepoURL"
              onChange={(value) => updateField("repoUrl", value)}
              value={form.repoUrl}
            />
            <AdminInput
              label="DemoURL"
              onChange={(value) => updateField("demoUrl", value)}
              value={form.demoUrl}
            />
          </div>
          <label className="flex items-center gap-3 text-sm text-slate-700">
            <input
              checked={form.featured}
              className="size-4 accent-accent"
              onChange={(event) =>
                updateField("featured", event.target.checked)
              }
              type="checkbox"
            />
            Featured
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Project"}
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
          alt="Current project photo"
          className="h-20 w-32 rounded-xl border border-slate-200 object-cover"
          src={currentUrl}
        />
      ) : null}
    </label>
  );
}

/**
 * Merender input teks standar untuk form admin.
 * Dipakai ProjectForm agar styling dan label input tidak diulang untuk setiap field.
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
        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
    </label>
  );
}

type AdminTextareaProps = AdminInputProps & {
  rows: number;
};

/**
 * Merender textarea standar untuk field panjang project.
 * Dipakai ProjectForm pada Description, Content, dan TechStack supaya UI tetap konsisten.
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
        className="resize-y rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        value={value}
      />
    </label>
  );
}
