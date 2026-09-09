"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { StateMessage } from "@/components/StateMessage";
import { TechTags } from "@/components/TechTags";
import { getProject, type Project } from "@/lib/api";

/**
 * Menampilkan detail satu project berdasarkan slug dari URL.
 * Dipakai route "/projects/[slug]" agar setiap project punya halaman case study sendiri dari API.
 */
export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Mengambil detail project saat slug tersedia dari router Next.js.
     * encodeURIComponent dilakukan di helper API supaya slug aman dipakai sebagai path backend.
     */
    async function loadProject() {
      if (!params.slug) {
        return;
      }

      try {
        setProject(await getProject(params.slug));
      } catch {
        setError("Detail project belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [params.slug]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <StateMessage
          message="Sebentar, saya sedang menyiapkan detail project."
          title="Loading project"
        />
      </section>
    );
  }

  if (error || !project) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <StateMessage
          message={error || "Project tidak ditemukan."}
          title="Project unavailable"
        />
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal>
        <Link
          className="text-sm font-medium text-accent hover:text-[#0d6d64]"
          href="/projects"
        >
          Back to projects
        </Link>
        <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-soft">
          {project.imageUrl ? (
            // img dipakai karena gambar project berasal dari backend dan dapat memakai URL eksternal.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${project.title} preview`}
              className="h-full w-full object-cover"
              src={project.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-heading text-6xl font-bold text-slate-300">
              {project.title.trim().charAt(0).toUpperCase() || "P"}
            </div>
          )}
        </div>
        <h1 className="mt-6 bg-gradient-to-r from-slate-900 via-slate-700 to-accent bg-clip-text text-xl font-semibold tracking-tight text-transparent sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-700">
          {project.description}
        </p>
      </Reveal>

      <Reveal
        className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-accent/30"
        delay={0.08}
      >
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Tech stack
        </h2>
        <div className="mt-4">
          <TechTags items={project.techStack} />
        </div>
      </Reveal>

      {/* <Reveal className="prose mt-10 max-w-none text-slate-700" delay={0.12}>
        <h2 className="text-2xl font-semibold text-slate-900">Project notes</h2>
        {project.content.split(/\n{2,}/).map((paragraph) => (
          <p className="leading-8" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </Reveal> */}

      <Reveal className="mt-10 flex flex-wrap gap-3" delay={0.16}>
        {project.repoUrl ? (
          <a
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-accent/30 hover:bg-accent-muted hover:text-accent"
            href={project.repoUrl}
            rel="noreferrer"
            target="_blank"
          >
            Repository
          </a>
        ) : null}
        {project.demoUrl ? (
          <a
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-[0_14px_28px_rgba(15,118,110,0.15)] transition hover:bg-[#0d6d64]"
            href={project.demoUrl}
            rel="noreferrer"
            target="_blank"
          >
            Live demo
          </a>
        ) : null}
      </Reveal>
    </article>
  );
}
