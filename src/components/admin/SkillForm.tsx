"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  createAdminSkills,
  getAdminSkillById,
  updateAdminSkill,
  type SkillPayload,
} from "@/lib/admin-api";

type SkillFormProps = {
  mode: "create" | "edit";
  skillId?: number;
};

const emptySkillForm: SkillPayload = {
  name: "",
  category: "",
};

/**
 * Menampilkan form create/edit skill admin.
 * Dipakai route /admin/skills/new dan /admin/skills/[id]/edit untuk mengelola skill publik.
 */
export function SkillForm({ mode, skillId }: SkillFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SkillPayload>(emptySkillForm);
  const [bulkInput, setBulkInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !skillId) {
      return;
    }

    const activeSkillId = skillId;

    async function loadSkill() {
      try {
        const skill = await getAdminSkillById(activeSkillId);

        if (!skill) {
          setError("Skill tidak ditemukan.");
          return;
        }

        setForm({
          name: skill.name,
          category: skill.category,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil data skill.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadSkill();
  }, [mode, skillId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const preparedNames = bulkInput
          .split(/\r?\n|,/)
          .map((item) => item.trim())
          .filter(Boolean);

        if (preparedNames.length === 0) {
          throw new Error("Masukkan minimal satu nama skill.");
        }

        await createAdminSkills(
          preparedNames.map((name) => ({
            name,
            category: form.category.trim(),
          })),
        );
      } else if (skillId) {
        await updateAdminSkill(skillId, form);
      }

      router.push("/admin");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan skill.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<Key extends keyof SkillPayload>(
    key: Key,
    value: SkillPayload[Key],
  ) {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  }

  return (
    <AdminShell
      description=""
      title={mode === "create" ? "Tambah Skill" : "Edit Skill"}
    >
      {isLoading ? (
        <p className="text-slate-600">Sedang memuat data skill...</p>
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
          {mode === "create" ? (
            <>
              <AdminInput
                label="Category"
                onChange={(value) => updateField("category", value)}
                required
                value={form.category}
              />
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Skill yang akan ditambahkan
                <textarea
                  className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent"
                  onChange={(event) => setBulkInput(event.target.value)}
                  placeholder="React&#10;Next.js&#10;Go"
                  value={bulkInput}
                />
              </label>
            </>
          ) : (
            <>
              <AdminInput
                label="Name"
                onChange={(value) => updateField("name", value)}
                required
                value={form.name}
              />
              <AdminInput
                label="Category"
                onChange={(value) => updateField("category", value)}
                required
                value={form.category}
              />
            </>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan Skill"
                  : "Update Skill"}
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
  type?: "text" | "number";
  onChange: (value: string) => void;
};

function AdminInput({
  label,
  value,
  required = false,
  type = "text",
  onChange,
}: AdminInputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
