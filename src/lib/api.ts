export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  techStack: string[];
  imageUrl: string;
  repoUrl: string;
  demoUrl: string;
  featured: boolean;
};

export type Experience = {
  id: number;
  company: string;
  imageUrl: string;
  location: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
};

export type Certification = {
  id: number;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
};

const defaultProfile: Profile = {
  id: 0,
  name: "Benny Amirul",
  email: "bennyamirul@gmail.com",
  avatarUrl: "",
};

export type ContactMessagePayload = {
  name: string;
  email: string;
  message: string;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
};

type RawProject = {
  ID?: number;
  id?: number;
  Title?: string;
  title?: string;
  Slug?: string;
  slug?: string;
  Description?: string;
  description?: string;
  Content?: string;
  content?: string;
  TechStack?: string;
  techStack?: string;
  ImageURL?: string;
  imageURL?: string;
  imageUrl?: string;
  RepoURL?: string;
  repoURL?: string;
  repoUrl?: string;
  DemoURL?: string;
  demoURL?: string;
  demoUrl?: string;
  Featured?: boolean;
  featured?: boolean;
};

type RawExperience = {
  ID?: number;
  id?: number;
  Company?: string;
  company?: string;
  ImageURL?: string;
  imageURL?: string;
  imageUrl?: string;
  Location?: string;
  location?: string;
  Role?: string;
  role?: string;
  StartDate?: string;
  startDate?: string;
  EndDate?: string | null;
  endDate?: string | null;
  Description?: string;
  description?: string;
};

type RawCertification = {
  ID?: number;
  id?: number;
  Title?: string;
  title?: string;
  Issuer?: string;
  issuer?: string;
  IssueDate?: string;
  issueDate?: string;
  CredentialURL?: string;
  credentialURL?: string;
  credentialUrl?: string;
  ImageURL?: string;
  imageURL?: string;
  imageUrl?: string;
};

type RawSkill = {
  ID?: number;
  id?: number;
  Name?: string;
  name?: string;
  Category?: string;
  category?: string;
  Order?: number;
  order?: number;
};

type RawProfile = {
  ID?: number;
  id?: number;
  Name?: string;
  name?: string;
  Email?: string;
  email?: string;
  AvatarURL?: string;
  avatarURL?: string;
  avatarUrl?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function resolveImageUrl(value: string) {
  if (!value) {
    return value;
  }

  if (API_URL && value.startsWith(API_URL.replace(/\/$/, "") + "/")) {
    return value.slice(API_URL.replace(/\/$/, "").length);
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return value;
}

function normalizeExternalUrl(value: string) {
  const normalizedValue = value.trim();

  if (
    !normalizedValue ||
    /^(https?:)?\/\//i.test(normalizedValue) ||
    /^(mailto:|tel:)/i.test(normalizedValue)
  ) {
    return normalizedValue;
  }

  return `https://${normalizedValue}`;
}

/**
 * Memastikan base URL API tersedia sebelum halaman mencoba request ke backend.
 * Dipakai oleh semua helper API di file ini supaya error konfigurasi terlihat jelas di browser,
 * bukan gagal diam-diam dengan URL kosong.
 */
function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL belum diset. Buat .env.local dan isi NEXT_PUBLIC_API_URL=http://localhost:8080.",
    );
  }

  return API_URL.replace(/\/$/, "");
}

/**
 * Mengambil JSON dari backend dan mengubah response error menjadi pesan yang ramah dibaca.
 * Dipakai oleh helper GET dan POST agar komponen halaman tidak perlu mengulang blok try/catch fetch.
 */
async function requestJson<T>(path: string, init?: RequestInit) {
  let response: Response;

  try {
    response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      `Tidak bisa terhubung ke backend di ${getApiUrl()}. Pastikan server Go + Gin sedang berjalan.`,
    );
  }

  const body = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  if (!response.ok) {
    throw new Error(
      body.error ??
        `Request gagal dengan status ${response.status}. Cek log backend untuk detailnya.`,
    );
  }

  if (body.data === undefined) {
    throw new Error(
      "Response API tidak memiliki field data. Cek format JSON dari backend.",
    );
  }

  return body.data;
}

/**
 * Mengubah string tech stack dari backend menjadi array tag yang mudah dirender.
 * Dipakai di card dan halaman detail karena backend tahap awal menyimpan TechStack sebagai satu string.
 */
export function parseTechStack(value: string) {
  return value
    .split(/[,|;/\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Menormalisasi field project dari format JSON Go yang kapital ke format camelCase TypeScript.
 * Dipakai setelah fetch supaya komponen UI bisa membaca properti yang konsisten dan lebih idiomatis di React.
 */
function normalizeProject(project: RawProject): Project {
  const techStack = project.TechStack ?? project.techStack ?? "";

  return {
    id: project.ID ?? project.id ?? 0,
    title: project.Title ?? project.title ?? "Untitled project",
    slug: project.Slug ?? project.slug ?? "",
    description: project.Description ?? project.description ?? "",
    content: project.Content ?? project.content ?? "",
    techStack: parseTechStack(techStack),
    imageUrl: resolveImageUrl(
      project.ImageURL ?? project.imageURL ?? project.imageUrl ?? "",
    ),
    repoUrl: normalizeExternalUrl(
      project.RepoURL ?? project.repoURL ?? project.repoUrl ?? "",
    ),
    demoUrl: normalizeExternalUrl(
      project.DemoURL ?? project.demoURL ?? project.demoUrl ?? "",
    ),
    featured: project.Featured ?? project.featured ?? false,
  };
}

/**
 * Menormalisasi field experience dari format JSON Go ke format camelCase TypeScript.
 * Dipakai halaman timeline agar rendering tanggal dan teks pengalaman tidak bergantung pada casing backend.
 */
function normalizeExperience(experience: RawExperience): Experience {
  return {
    id: experience.ID ?? experience.id ?? 0,
    company: experience.Company ?? experience.company ?? "Unknown company",
    imageUrl: resolveImageUrl(
      experience.ImageURL ?? experience.imageURL ?? experience.imageUrl ?? "",
    ),
    location: experience.Location ?? experience.location ?? "",
    role: experience.Role ?? experience.role ?? "Role",
    startDate: experience.StartDate ?? experience.startDate ?? "",
    endDate: experience.EndDate ?? experience.endDate ?? null,
    description: experience.Description ?? experience.description ?? "",
  };
}

/**
 * Menormalisasi field certification dari backend Go ke camelCase yang nyaman dipakai komponen React.
 * Dipakai oleh halaman certificates dan preview home supaya casing response tidak bocor ke UI.
 */
function normalizeCertification(
  certification: RawCertification,
): Certification {
  return {
    id: certification.ID ?? certification.id ?? 0,
    title:
      certification.Title ?? certification.title ?? "Untitled certification",
    issuer: certification.Issuer ?? certification.issuer ?? "Unknown issuer",
    issueDate: certification.IssueDate ?? certification.issueDate ?? "",
    credentialUrl:
      certification.CredentialURL ??
      certification.credentialURL ??
      certification.credentialUrl ??
      "",
    imageUrl: resolveImageUrl(
      certification.ImageURL ??
        certification.imageURL ??
        certification.imageUrl ??
        "",
    ),
  };
}

function normalizeSkill(skill: RawSkill): Skill {
  return {
    id: skill.ID ?? skill.id ?? 0,
    name: skill.Name ?? skill.name ?? "Untitled skill",
    category: skill.Category ?? skill.category ?? "General",
  };
}

function normalizeProfile(profile: RawProfile): Profile {
  return {
    id: profile.ID ?? profile.id ?? 0,
    name: profile.Name ?? profile.name ?? "Benny Amirul",
    email: profile.Email ?? profile.email ?? "bennyamirul@gmail.com",
    avatarUrl: resolveImageUrl(
      profile.AvatarURL ?? profile.avatarURL ?? profile.avatarUrl ?? "",
    ),
  };
}

/**
 * Mengambil semua project dari GET /api/projects.
 * Dipakai halaman home dan projects supaya daftar project selalu berasal dari satu sumber helper API.
 */
export async function getProjects() {
  const projects = await requestJson<RawProject[]>("/api/projects");

  return projects.map(normalizeProject);
}

/**
 * Mengambil detail satu project dari GET /api/projects/:slug.
 * Dipakai halaman projects/[slug] agar slug URL menjadi identifier publik yang dibaca backend.
 */
export async function getProject(slug: string) {
  const decodedSlug = decodeURIComponent(slug);

  try {
    const project = await requestJson<RawProject>(
      `/api/projects/${encodeURIComponent(decodedSlug)}`,
    );

    return normalizeProject(project);
  } catch (detailError) {
    // Fallback untuk data lama yang memiliki slug dengan spasi atau format URL yang belum konsisten.
    try {
      const projects = await getProjects();
      const project = projects.find((item) => item.slug === decodedSlug);

      if (project) {
        return project;
      }
    } catch {
      // Pertahankan error detail awal agar halaman tetap menampilkan state error yang benar.
    }

    throw detailError;
  }
}

/**
 * Mengambil timeline experience dari GET /api/experience.
 * Dipakai halaman experience untuk menjaga semua request API tetap terkumpul di lib/api.ts.
 */
export async function getExperiences() {
  const experiences = await requestJson<RawExperience[]>("/api/experience");

  return experiences.map(normalizeExperience);
}

/**
 * Mengambil semua certification dari GET /api/certifications.
 * Dipakai halaman certificates dan preview home supaya request baru tetap melewati helper API yang sama.
 */
export async function getCertifications() {
  const certifications = await requestJson<RawCertification[]>(
    "/api/certifications",
  );

  return certifications.map(normalizeCertification);
}

/**
 * Mengambil semua skill dari GET /api/skills.
 * Dipakai homepage dan admin helper supaya data skill bersumber dari backend yang sama.
 */
export async function getSkills() {
  const skills = await requestJson<RawSkill[]>("/api/skills");

  return skills
    .map(normalizeSkill)
    .sort(
      (left, right) =>
        left.category.localeCompare(right.category) ||
        left.name.localeCompare(right.name) ||
        left.id - right.id,
    );
}

export async function getProfile() {
  try {
    const profile = await requestJson<RawProfile>("/api/profile");
    return normalizeProfile(profile);
  } catch {
    return defaultProfile;
  }
}

/**
 * Mengirim pesan contact form ke POST /api/messages.
 * Dipakai halaman contact supaya validasi dan pesan error backend tetap bisa ditampilkan ke user.
 */
export async function sendMessage(payload: ContactMessagePayload) {
  return requestJson<unknown>("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
