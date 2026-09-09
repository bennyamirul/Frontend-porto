"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CertificationCard } from "@/components/CertificationCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StateMessage } from "@/components/StateMessage";
import { TechTags } from "@/components/TechTags";
import { useTypewriter } from "@/hooks/useTypewriter";
import {
  getCertifications,
  getExperiences,
  getProjects,
  getSkills,
  type Certification,
  type Experience,
  type Project,
  type Skill,
} from "@/lib/api";

const typewriterRoles = [
  "Web Developer",
  "Program Analyst",
  "Fullstack Developer",
];

function isPortfolioStackPlaceholder(project: Project) {
  return (
    project.title.trim().toLowerCase() === "portfolio-stack.ts" ||
    project.slug === "portfolio-stack-ts"
  );
}

/**
 * Menampilkan landing page portfolio dengan hero, about preview, skills, dan project unggulan.
 * Dipakai route "/" sebagai first impression yang langsung mengarah ke karya dan contact.
 */
export default function Home() {
  const typedRole = useTypewriter({ words: typewriterRoles });
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [isLoadingCertifications, setIsLoadingCertifications] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [experiencesError, setExperiencesError] = useState("");
  const [certificationsError, setCertificationsError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [showAllSkills, setShowAllSkills] = useState(false);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const data = await getProjects();
        setProjects(
          data
            .filter(
              (project) =>
                project.featured && !isPortfolioStackPlaceholder(project),
            )
            .slice(0, 4),
        );
      } catch {
        setProjectsError("Project pilihan belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoadingProjects(false);
      }

      try {
        setExperiences((await getExperiences()).slice(0, 2));
      } catch {
        setExperiencesError(
          "Ringkasan pengalaman belum bisa ditampilkan saat ini.",
        );
      } finally {
        setIsLoadingExperiences(false);
      }

      try {
        setCertifications((await getCertifications()).slice(0, 3));
      } catch {
        setCertificationsError("Sertifikasi belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoadingCertifications(false);
      }

      try {
        setSkills(await getSkills());
      } catch {
        setSkillsError("Skill belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoadingSkills(false);
      }
    }

    loadHomeData();
  }, []);

  return (
    <div className="bg-background text-slate-800">
      <section className="relative overflow-hidden border-b border-black/10 bg-[#fafaf9]">
        <div className="absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full bg-black/3 blur-3xl" />
        <div className="relative mx-auto grid min-h-[72vh] max-w-4xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                Open to Work
              </span>
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-black sm:text-5xl">
              Hello, My Name is Benny Amirul Hakim
            </h1>
            <p
              className="mt-2 font-mono text-base text-gray-600 sm:text-lg"
              aria-label={`Current role: ${typedRole}`}
            >
              {typedRole}
              <span className="ml-1 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-black" />
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 no-underline decoration-transparent">
              Building modern web applications with PHP, Laravel, and
              JavaScript. Currently exploring React, Next.js, Golang, and other
              technologies to build better and scalable digital solutions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition hover:bg-gray-800"
                href="/projects"
              >
                Explore projects
              </Link>
              <Link
                className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-black/20 hover:bg-gray-50"
                href="/contact"
              >
                Start a conversation
              </Link>
            </div>
          </Reveal>

          <Reveal
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            delay={0.12}
          >
            <div className="flex items-center justify-between border-b border-black/10 pb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-gray-500">
              <span>portfolio-stack.ts</span>
              <span className="rounded-full bg-black px-2 py-1 text-[9px] font-semibold text-white">
                live
              </span>
            </div>
            <pre className="mt-5 overflow-hidden text-sm leading-7 text-gray-700">
              <code>{`const focus = {
  frontend: ["React", "Next.js"],
  backend: ["Laravel", "Go", "Gin"],
  database: ["PostgreSQL", "MySQL"],
  focus: "full stack development",
  goal: "building modern and 
  scalable web applications",
};`}</code>
            </pre>
          </Reveal>
        </div>
      </section>

      {/* <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
        <Reveal>
          <SectionHeading
            description="Saya menyukai UI yang ringkas, state yang eksplisit, dan integrasi API yang mudah di-debug. Pendekatannya sederhana: pahami data, bentuk pengalaman yang jelas, lalu poles interaksinya secukupnya."
            eyebrow="About"
            title="Built like a product, not a brochure."
          />
        </Reveal>
      </section> */}

      <section className="border-y border-black/10 bg-white/60">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                // description="Teknologi yang saya pakai untuk membangun fitur dengan fokus pada delivery, skalabilitas, dan pengalaman pengguna yang jelas."
                eyebrow="Skills"
                title="Tools I use to ship practical interfaces."
              />
              <button
                className="text-sm font-medium text-gray-700 transition hover:text-black"
                onClick={() => setShowAllSkills((current) => !current)}
                type="button"
              >
                {showAllSkills ? "Show less" : "Show all"}
              </button>
            </div>
          </Reveal>
          <Reveal className="mt-8" delay={0.5}>
            <SkillsSection
              isLoading={isLoadingSkills}
              skills={skills}
              skillsError={skillsError}
              showAll={showAllSkills}
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              // description="Ringkasan pengalaman kerja terbaru saya - klik untuk baca detail lengkapnya."
              eyebrow="Experience"
              title="Recent roles, expandable by intent."
            />
            <Link
              className="text-sm font-medium text-gray-700 hover:text-black"
              href="/experience"
            >
              View all experience
            </Link>
          </div>
        </Reveal>
        <div className="mt-5 space-y-4">
          {isLoadingExperiences ? (
            <StateMessage
              message="Sebentar, saya sedang menyiapkan ringkasan pengalaman."
              title="Loading experience"
            />
          ) : experiencesError ? (
            <StateMessage
              message={experiencesError}
              title="Experience unavailable"
            />
          ) : experiences.length > 0 ? (
            experiences.map((experience, index) => (
              <Reveal delay={index * 0.05} key={experience.id}>
                <ExperienceCard experience={experience} />
              </Reveal>
            ))
          ) : (
            <StateMessage
              message="Belum ada pengalaman yang bisa ditampilkan."
              title="No experience found"
            />
          )}
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/60">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                description="Kursus dan sertifikasi yang sudah saya selesaikan."
                eyebrow="Certifications"
                title="Verified learning signals."
              />
              <Link
                className="text-sm font-medium text-gray-700 hover:text-black"
                href="/certificates"
              >
                Lihat Semua
              </Link>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {isLoadingCertifications ? (
              <StateMessage
                message="Sebentar, saya sedang menyiapkan daftar sertifikasi."
                title="Loading certifications"
              />
            ) : certificationsError ? (
              <StateMessage
                message={certificationsError}
                title="Certifications unavailable"
              />
            ) : certifications.length > 0 ? (
              certifications.map((certification, index) => (
                <Reveal delay={index * 0.05} key={certification.id}>
                  <CertificationCard certification={certification} />
                </Reveal>
              ))
            ) : (
              <StateMessage
                message="Belum ada sertifikasi yang bisa ditampilkan."
                title="No certifications found"
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              description="Beberapa project pilihan yang pernah saya kerjakan."
              eyebrow="Featured projects"
              title="Selected work."
            />
            <Link
              className="text-sm font-medium text-gray-700 hover:text-black"
              href="/projects"
            >
              View all projects
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {isLoadingProjects ? (
            <StateMessage
              message="Sebentar, saya sedang menyiapkan project pilihan."
              title="Loading projects"
            />
          ) : projectsError ? (
            <StateMessage
              message={projectsError}
              title="Projects unavailable"
            />
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <Reveal delay={index * 0.05} key={project.slug}>
                <ProjectCard project={project} />
              </Reveal>
            ))
          ) : (
            <StateMessage
              message="Belum ada project pilihan yang bisa ditampilkan."
              title="No featured projects yet"
            />
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Menampilkan skill dalam kategori dan sekaligus deretan marquee supaya semua kemampuan bisa terlihat cepat tanpa mengurangi scan-ability.
 */
function SkillsSection({
  isLoading,
  skills,
  skillsError,
  showAll,
}: {
  isLoading: boolean;
  skills: Skill[];
  skillsError: string;
  showAll: boolean;
}) {
  if (isLoading) {
    return (
      <StateMessage
        message="Sebentar, saya sedang menyiapkan daftar skill."
        title="Loading skills"
      />
    );
  }

  if (skillsError) {
    return <StateMessage message={skillsError} title="Skills unavailable" />;
  }

  if (skills.length === 0) {
    return (
      <StateMessage
        message="Belum ada skill yang bisa ditampilkan."
        title="No skills found"
      />
    );
  }

  const skillGroups = skills.reduce<Record<string, string[]>>(
    (groups, skill) => {
      const key = skill.category || "General";
      groups[key] = [...(groups[key] ?? []), skill.name];
      return groups;
    },
    {},
  );

  const groups = Object.entries(skillGroups)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([title, items]) => ({ title, skills: items }));

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
        <div className="marquee-track flex min-w-max items-center gap-3 py-2">
          {skills.concat(skills).map((skill, index) => (
            <span
              className="rounded-full border border-black/10 bg-[#f7f6f3] px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-gray-700 uppercase"
              key={`${skill.id}-${index}`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {showAll ? (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent/30"
              key={group.title}
            >
              <h3 className="mb-4 font-mono text-sm uppercase tracking-[0.18em] text-accent">
                {group.title}
              </h3>
              <TechTags items={group.skills} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
