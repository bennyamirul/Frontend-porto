"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  deleteAdminExperience,
  deleteAdminCertification,
  deleteAdminProject,
  deleteAdminSkill,
  getAdminExperiences,
  getAdminCertifications,
  getAdminMessages,
  getAdminProjects,
  getAdminSkills,
  logoutAdmin,
  type AdminMessage,
} from "@/lib/admin-api";
import type { Certification, Experience, Project, Skill } from "@/lib/api";
import { formatMonthYear } from "@/lib/format";

/**
 * Mengubah timestamp ISO dari backend menjadi teks tanggal dan jam yang mudah dibaca.
 * Dipakai list Messages agar waktu masuk pesan tampil jelas untuk admin.
 */
function formatMessageTime(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

/**
 * Menampilkan dashboard admin dengan project, experience, messages, dan logout.
 * Dipakai route /admin; saat mount endpoint protected dipanggil sehingga 401 otomatis redirect ke /admin/login.
 */
export function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [projectsError, setProjectsError] = useState("");
  const [experiencesError, setExperiencesError] = useState("");
  const [certificationsError, setCertificationsError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [messagesError, setMessagesError] = useState("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [isLoadingCertifications, setIsLoadingCertifications] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    /**
     * Memuat data dashboard saat halaman dibuka.
     * Messages dipanggil dari endpoint admin supaya sekaligus menjadi pengecekan cookie login.
     */
    async function loadDashboard() {
      try {
        setMessages(await getAdminMessages());
      } catch (loadError) {
        setMessagesError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil pesan.",
        );
      } finally {
        setIsLoadingMessages(false);
      }

      try {
        setProjects(await getAdminProjects());
      } catch (loadError) {
        setProjectsError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil project.",
        );
      } finally {
        setIsLoadingProjects(false);
      }

      try {
        setExperiences(await getAdminExperiences());
      } catch (loadError) {
        setExperiencesError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil experience.",
        );
      } finally {
        setIsLoadingExperiences(false);
      }

      try {
        setCertifications(await getAdminCertifications());
      } catch (loadError) {
        setCertificationsError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil sertifikat.",
        );
      } finally {
        setIsLoadingCertifications(false);
      }

      try {
        setSkills(await getAdminSkills());
      } catch (loadError) {
        setSkillsError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal mengambil skill.",
        );
      } finally {
        setIsLoadingSkills(false);
      }
    }

    loadDashboard();
  }, []);

  /**
   * Menghapus project setelah confirm browser.
   * Dipakai tombol Delete per item agar data tidak terhapus karena klik tidak sengaja.
   */
  async function handleDeleteProject(project: Project) {
    if (!window.confirm(`Hapus project "${project.title}"?`)) {
      return;
    }

    try {
      await deleteAdminProject(project.id);
      setProjects((currentProjects) =>
        currentProjects.filter((item) => item.id !== project.id),
      );
    } catch (deleteError) {
      setProjectsError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus project.",
      );
    }
  }

  /**
   * Menghapus experience setelah confirm browser.
   * Dipakai tombol Delete per item agar admin masih punya kesempatan membatalkan aksi.
   */
  async function handleDeleteExperience(experience: Experience) {
    if (
      !window.confirm(
        `Hapus experience "${experience.role}" di ${experience.company}?`,
      )
    ) {
      return;
    }

    try {
      await deleteAdminExperience(experience.id);
      setExperiences((currentExperiences) =>
        currentExperiences.filter((item) => item.id !== experience.id),
      );
    } catch (deleteError) {
      setExperiencesError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus experience.",
      );
    }
  }

  async function handleDeleteSkill(skill: Skill) {
    if (!window.confirm(`Hapus skill "${skill.name}"?`)) {
      return;
    }

    try {
      await deleteAdminSkill(skill.id);
      setSkills((currentSkills) =>
        currentSkills.filter((item) => item.id !== skill.id),
      );
    } catch (deleteError) {
      setSkillsError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus skill.",
      );
    }
  }

  async function handleDeleteCertification(certification: Certification) {
    if (!window.confirm(`Hapus sertifikat "${certification.title}"?`)) {
      return;
    }

    try {
      await deleteAdminCertification(certification.id);
      setCertifications((currentCertifications) =>
        currentCertifications.filter((item) => item.id !== certification.id),
      );
    } catch (deleteError) {
      setCertificationsError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus sertifikat.",
      );
    }
  }

  /**
   * Mengakhiri sesi admin lalu kembali ke halaman login.
   * Dipakai tombol pojok dashboard; backend menghapus cookie admin_token dengan Set-Cookie kedaluwarsa.
   */
  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logoutAdmin();
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  }

  return (
    <AdminShell
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
            href="/admin/profile"
          >
            Edit Profile
          </Link>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? "Logout..." : "Logout"}
          </button>
        </div>
      }
      description=""
      title="Dashboard"
    >
      <div className="grid gap-6">
        <AdminProjectsSection
          error={projectsError}
          isLoading={isLoadingProjects}
          onDelete={handleDeleteProject}
          projects={projects}
        />
        <AdminExperienceSection
          error={experiencesError}
          experiences={experiences}
          isLoading={isLoadingExperiences}
          onDelete={handleDeleteExperience}
        />
        <AdminCertificationsSection
          certifications={certifications}
          error={certificationsError}
          isLoading={isLoadingCertifications}
          onDelete={handleDeleteCertification}
        />
        <AdminSkillsSection
          error={skillsError}
          isLoading={isLoadingSkills}
          onDelete={handleDeleteSkill}
          skills={skills}
        />
        <AdminMessagesSection
          error={messagesError}
          isLoading={isLoadingMessages}
          messages={messages}
        />
      </div>
    </AdminShell>
  );
}

type AdminProjectsSectionProps = {
  projects: Project[];
  isLoading: boolean;
  error: string;
  onDelete: (project: Project) => void;
};

/**
 * Menampilkan daftar project admin beserta tombol tambah, edit, dan delete.
 * Dipakai AdminDashboard untuk memisahkan UI list project dari logika fetch utama.
 */
type AdminSkillsSectionProps = {
  skills: Skill[];
  isLoading: boolean;
  error: string;
  onDelete: (skill: Skill) => void;
};

function AdminSkillsSection({
  skills,
  isLoading,
  error,
  onDelete,
}: AdminSkillsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
          <p className="mt-1 text-sm text-slate-600">
            Data skill dari GET /api/skills dan endpoint admin
            /api/admin/skills.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64]"
          href="/admin/skills/new"
        >
          + Tambah Skill
        </Link>
      </div>
      {isLoading ? <AdminState text="Sedang memuat skill..." /> : null}
      {error ? <AdminState text={error} tone="error" /> : null}
      {!isLoading && !error && skills.length === 0 ? (
        <AdminState text="Belum ada skill." />
      ) : null}
      <div className="mt-4 divide-y divide-slate-200">
        {skills.map((skill) => (
          <article
            className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
            key={skill.id}
          >
            <div>
              <h3 className="font-semibold text-slate-900">{skill.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{skill.category}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                className="rounded-full border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
                href={`/admin/skills/${skill.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:border-red-300 hover:bg-red-100"
                onClick={() => onDelete(skill)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminProjectsSection({
  projects,
  isLoading,
  error,
  onDelete,
}: AdminProjectsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
          <p className="mt-1 text-sm text-slate-600">
            Data publik diambil dari GET /api/projects.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64]"
          href="/admin/projects/new"
        >
          + Tambah Project
        </Link>
      </div>
      {isLoading ? <AdminState text="Sedang memuat project..." /> : null}
      {error ? <AdminState text={error} tone="error" /> : null}
      {!isLoading && !error && projects.length === 0 ? (
        <AdminState text="Belum ada project." />
      ) : null}
      <div className="mt-4 divide-y divide-slate-200">
        {projects.map((project) => (
          <article
            className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
            key={project.id}
          >
            <div>
              <h3 className="font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {project.description}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">
                /{project.slug}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                className="rounded-full border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
                href={`/admin/projects/${project.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="rounded-full border border-red-200 bg-transparent px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                onClick={() => onDelete(project)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type AdminExperienceSectionProps = {
  experiences: Experience[];
  isLoading: boolean;
  error: string;
  onDelete: (experience: Experience) => void;
};

/**
 * Menampilkan daftar experience admin beserta tombol tambah, edit, dan delete.
 * Dipakai AdminDashboard agar section Experience tetap fokus pada rendering data.
 */
function AdminExperienceSection({
  experiences,
  isLoading,
  error,
  onDelete,
}: AdminExperienceSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Experience</h2>
          <p className="mt-1 text-sm text-slate-600">
            Data publik diambil dari GET /api/experience.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64]"
          href="/admin/experience/new"
        >
          + Tambah Experience
        </Link>
      </div>
      {isLoading ? <AdminState text="Sedang memuat experience..." /> : null}
      {error ? <AdminState text={error} tone="error" /> : null}
      {!isLoading && !error && experiences.length === 0 ? (
        <AdminState text="Belum ada experience." />
      ) : null}
      <div className="mt-4 divide-y divide-slate-200">
        {experiences.map((experience) => (
          <article
            className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
            key={experience.id}
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                {experience.role}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {experience.company}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">
                {formatMonthYear(experience.startDate)} -{" "}
                {formatMonthYear(experience.endDate)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                className="rounded-full border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
                href={`/admin/experience/${experience.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="rounded-full border border-red-200 bg-transparent px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                onClick={() => onDelete(experience)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type AdminCertificationsSectionProps = {
  certifications: Certification[];
  isLoading: boolean;
  error: string;
  onDelete: (certification: Certification) => void;
};

function AdminCertificationsSection({
  certifications,
  isLoading,
  error,
  onDelete,
}: AdminCertificationsSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Certificates</h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola sertifikat yang tampil di halaman publik.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-[0_12px_24px_rgba(15,118,110,0.12)] transition hover:bg-[#0d6d64]"
          href="/admin/certifications/new"
        >
          + Tambah Sertifikat
        </Link>
      </div>
      {isLoading ? <AdminState text="Sedang memuat sertifikat..." /> : null}
      {error ? <AdminState text={error} tone="error" /> : null}
      {!isLoading && !error && certifications.length === 0 ? (
        <AdminState text="Belum ada sertifikat." />
      ) : null}
      <div className="mt-4 divide-y divide-slate-200">
        {certifications.map((certification) => (
          <article
            className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between"
            key={certification.id}
          >
            <div>
              <h3 className="font-semibold text-slate-900">
                {certification.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {certification.issuer}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500">
                {certification.issueDate || "Issue date TBA"}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                className="rounded-full border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
                href={`/admin/certifications/${certification.id}/edit`}
              >
                Edit
              </Link>
              <button
                className="rounded-full border border-red-200 bg-transparent px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                onClick={() => onDelete(certification)}
                type="button"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type AdminMessagesSectionProps = {
  messages: AdminMessage[];
  isLoading: boolean;
  error: string;
};

/**
 * Menampilkan pesan contact secara read-only.
 * Dipakai AdminDashboard supaya pesan masuk bisa dibaca tanpa menyediakan aksi mutasi tambahan.
 */
function AdminMessagesSection({
  messages,
  isLoading,
  error,
}: AdminMessagesSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Messages</h2>
      <p className="mt-1 text-sm text-slate-600">
        Read-only dari GET /api/admin/messages.
      </p>
      {isLoading ? <AdminState text="Sedang memuat pesan..." /> : null}
      {error ? <AdminState text={error} tone="error" /> : null}
      {!isLoading && !error && messages.length === 0 ? (
        <AdminState text="Belum ada pesan masuk." />
      ) : null}
      <div className="mt-4 grid gap-3">
        {messages.map((message) => (
          <article
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-accent/30"
            key={message.id}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{message.name}</h3>
                <a
                  className="text-sm text-accent hover:text-[#0d6d64]"
                  href={`mailto:${message.email}`}
                >
                  {message.email}
                </a>
              </div>
              <time className="font-mono text-xs text-slate-500">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

type AdminStateProps = {
  text: string;
  tone?: "default" | "error";
};

/**
 * Menampilkan state kecil untuk loading, empty, atau error di panel admin.
 * Dipakai semua section dashboard agar pesan status punya tampilan konsisten.
 */
function AdminState({ text, tone = "default" }: AdminStateProps) {
  return (
    <p
      className={`mt-4 rounded-2xl border px-3 py-2 text-sm ${tone === "error" ? "border-red-200 text-red-600" : "border-slate-200 text-slate-600"}`}
    >
      {text}
    </p>
  );
}
