import {
  getCertifications,
  getExperiences,
  getProjects,
  getSkills,
  type Experience,
  type Certification,
  type Profile,
  type Project,
  type Skill,
} from "@/lib/api";

export type AdminMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type ProjectPayload = {
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string;
  imageUrl: string;
  repoUrl: string;
  demoUrl: string;
  featured: boolean;
};

export type ExperiencePayload = {
  company: string;
  imageUrl: string;
  location: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

export type CertificationPayload = {
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
};

export type SkillPayload = {
  name: string;
  category: string;
};

export type ProfilePayload = {
  name: string;
  email: string;
  avatarUrl: string;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
  message?: string;
};

type RawAdminMessage = {
  ID?: number;
  id?: number;
  Name?: string;
  name?: string;
  Email?: string;
  email?: string;
  Message?: string;
  message?: string;
  CreatedAt?: string;
  createdAt?: string;
};

type RawAdminSkill = {
  ID?: number;
  id?: number;
  Name?: string;
  name?: string;
  Category?: string;
  category?: string;
  Order?: number;
  order?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Membaca base URL backend dari environment frontend.
 * Dipakai semua request admin agar URL backend tetap mengikuti .env.local dan tidak hardcoded di komponen.
 */
function getAdminApiUrl() {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum diset. Buat .env.local dan isi NEXT_PUBLIC_API_URL=http://localhost:8080.",
    );
  }

  return API_URL.replace(/\/$/, "");
}

/**
 * Mengarahkan browser ke halaman login saat cookie admin tidak valid.
 * Dipakai helper admin karena cookie httpOnly tidak bisa dibaca JavaScript, jadi status 401 dari backend adalah sinyal logout.
 */
function redirectToAdminLogin() {
  if (
    typeof window !== "undefined" &&
    window.location.pathname !== "/admin/login"
  ) {
    window.location.replace(`${window.location.origin}/admin/login`);
  }
}

/**
 * Mengambil pesan error dari body JSON backend tanpa menganggap format response selalu lengkap.
 * Dipakai saat response gagal supaya form/list bisa menampilkan pesan backend seperti "Password salah".
 */
async function readApiEnvelope<T>(response: Response) {
  return (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
}

/**
 * Mengirim request ke endpoint /api/admin/* dengan cookie browser.
 * Dipakai semua aksi admin karena cookie httpOnly hanya ikut terkirim kalau fetch memakai credentials: "include".
 */
async function adminRequest<T>(
  path: string,
  init?: RequestInit,
  redirectOnUnauthorized = true,
) {
  let response: Response;

  try {
    response = await fetch(`${getAdminApiUrl()}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...(init?.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      `Tidak bisa terhubung ke backend di ${getAdminApiUrl()}. Pastikan server Go + Gin sedang berjalan.`,
    );
  }

  const body = await readApiEnvelope<T>(response);

  if (response.status === 401 && redirectOnUnauthorized) {
    redirectToAdminLogin();
    throw new Error("Sesi admin sudah habis. Mengarahkan ke halaman login.");
  }

  if (!response.ok) {
    throw new Error(
      body.error ??
        body.message ??
        `Request gagal dengan status ${response.status}.`,
    );
  }

  return body.data as T;
}

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const imagePath = await adminRequest<{ imageUrl: string }>(
    "/api/admin/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  return imagePath.imageUrl;
}

/**
 * Mengubah response message dari model Go ke bentuk camelCase yang enak dipakai React.
 * Dipakai dashboard admin agar rendering tabel tidak bergantung pada casing JSON dari backend.
 */
function normalizeAdminMessage(message: RawAdminMessage): AdminMessage {
  return {
    id: message.ID ?? message.id ?? 0,
    name: message.Name ?? message.name ?? "",
    email: message.Email ?? message.email ?? "",
    message: message.Message ?? message.message ?? "",
    createdAt: message.CreatedAt ?? message.createdAt ?? "",
  };
}

function normalizeAdminSkill(skill: RawAdminSkill): Skill {
  return {
    id: skill.ID ?? skill.id ?? 0,
    name: skill.Name ?? skill.name ?? "Untitled skill",
    category: skill.Category ?? skill.category ?? "General",
  };
}

/**
 * Login admin memakai password lalu meminta backend memasang cookie httpOnly.
 * Dipakai route /admin/login; 401 tidak auto-redirect supaya pesan "Password salah" tetap terlihat di form.
 */
export async function loginAdmin(password: string) {
  return adminRequest<unknown>(
    "/api/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ password }),
    },
    false,
  );
}

/**
 * Logout admin dengan menghapus cookie admin_token di backend.
 * Dipakai tombol Logout pada dashboard agar sesi admin benar-benar berakhir di browser.
 */
export async function logoutAdmin() {
  return adminRequest<unknown>("/api/admin/logout", { method: "POST" });
}

/**
 * Mengecek sesi admin lewat endpoint pesan yang memang protected.
 * Dipakai dashboard saat mount; kalau cookie tidak valid, helper otomatis redirect ke /admin/login.
 */
export async function checkAdminSession() {
  await getAdminMessages();
}

/**
 * Mengambil semua pesan contact dari endpoint admin.
 * Dipakai section Messages di dashboard dan sekaligus menjadi pemeriksaan auth karena endpoint ini protected.
 */
export async function getAdminMessages() {
  const messages = await adminRequest<RawAdminMessage[]>("/api/admin/messages");

  return (messages ?? []).map(normalizeAdminMessage);
}

/**
 * Mengambil daftar project dari endpoint publik untuk kebutuhan list dan prefill form admin.
 * Dipakai dashboard dan form edit karena backend saat ini belum menyediakan GET /api/admin/projects/:id.
 */
export async function getAdminProjects() {
  return getProjects();
}

/**
 * Mengambil satu project berdasarkan ID dari daftar publik.
 * Dipakai form edit project; ID tetap dipakai untuk PUT admin, sedangkan data awal diambil dari endpoint publik.
 */
export async function getAdminProjectById(id: number) {
  const projects = await getProjects();

  return projects.find((project) => project.id === id) ?? null;
}

/**
 * Membuat project baru melalui endpoint admin.
 * Dipakai route /admin/projects/new; payload mengikuti field JSON yang dibaca backend Go.
 */
export async function createAdminProject(payload: ProjectPayload) {
  return adminRequest<Project>("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Mengubah project existing melalui endpoint admin berbasis ID.
 * Dipakai route /admin/projects/[id]/edit dan otomatis membawa cookie admin via helper.
 */
export async function updateAdminProject(id: number, payload: ProjectPayload) {
  return adminRequest<Project>(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Menghapus project melalui endpoint admin setelah user mengonfirmasi.
 * Dipakai dashboard section Projects dan tetap mengirim cookie httpOnly melalui credentials include.
 */
export async function deleteAdminProject(id: number) {
  return adminRequest<unknown>(`/api/admin/projects/${id}`, {
    method: "DELETE",
  });
}

/**
 * Mengambil daftar experience dari endpoint publik untuk list dan prefill form admin.
 * Dipakai dashboard dan form edit karena backend belum menyediakan GET detail khusus admin.
 */
export async function getAdminExperiences() {
  return getExperiences();
}

/**
 * Mengambil satu experience berdasarkan ID dari daftar publik.
 * Dipakai form edit experience; ID ini kemudian dikirim ke endpoint PUT admin.
 */
export async function getAdminExperienceById(id: number) {
  const experiences = await getExperiences();

  return experiences.find((experience) => experience.id === id) ?? null;
}

/**
 * Membuat experience baru melalui endpoint admin.
 * Dipakai route /admin/experience/new dengan tanggal yang sudah diubah menjadi format ISO untuk Go time.Time.
 */
export async function createAdminExperience(payload: ExperiencePayload) {
  return adminRequest<Experience>("/api/admin/experience", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Mengubah experience existing melalui endpoint admin berbasis ID.
 * Dipakai route /admin/experience/[id]/edit dan otomatis mengirim cookie admin.
 */
export async function updateAdminExperience(
  id: number,
  payload: ExperiencePayload,
) {
  return adminRequest<Experience>(`/api/admin/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Menghapus experience melalui endpoint admin setelah confirm browser.
 * Dipakai dashboard section Experience agar data tidak terhapus tanpa persetujuan eksplisit.
 */
export async function deleteAdminExperience(id: number) {
  return adminRequest<unknown>(`/api/admin/experience/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminCertifications() {
  return getCertifications();
}

export async function getAdminCertificationById(id: number) {
  const certifications = await getCertifications();

  return (
    certifications.find((certification) => certification.id === id) ?? null
  );
}

export async function createAdminCertification(payload: CertificationPayload) {
  return adminRequest<Certification>("/api/admin/certifications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminCertification(
  id: number,
  payload: CertificationPayload,
) {
  return adminRequest<Certification>(`/api/admin/certifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminCertification(id: number) {
  return adminRequest<unknown>(`/api/admin/certifications/${id}`, {
    method: "DELETE",
  });
}

export async function getAdminSkills() {
  const skills = await adminRequest<RawAdminSkill[]>("/api/admin/skills");

  return (skills ?? []).map(normalizeAdminSkill);
}

export async function getAdminSkillById(id: number) {
  const skills = await getSkills();

  return skills.find((skill) => skill.id === id) ?? null;
}

export async function getAdminProfile() {
  return adminRequest<Profile>("/api/admin/profile");
}

export async function updateAdminProfile(payload: ProfilePayload) {
  return adminRequest<Profile>("/api/admin/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function createAdminSkill(payload: SkillPayload) {
  return adminRequest<unknown>("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createAdminSkills(payloads: SkillPayload[]) {
  if (payloads.length === 0) {
    throw new Error("Pilih minimal satu skill untuk ditambahkan.");
  }

  return adminRequest<unknown>("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify({ skills: payloads }),
  });
}

export async function updateAdminSkill(id: number, payload: SkillPayload) {
  return adminRequest<unknown>(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminSkill(id: number) {
  return adminRequest<unknown>(`/api/admin/skills/${id}`, { method: "DELETE" });
}
