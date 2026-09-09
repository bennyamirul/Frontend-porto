"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/api";
import { TechTags } from "./TechTags";

type ProjectCardProps = {
  project: Project;
};

/**
 * Menampilkan ringkasan satu project dalam grid/list.
 * Dipakai halaman home dan projects agar pola preview project konsisten dan klik menuju detail slug.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const detailPath = `/projects/${encodeURIComponent(project.slug)}`;

  function openProjectDetail() {
    router.push(detailPath);
  }

  function handleCardKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectDetail();
    }
  }

  return (
    <article
      aria-label={`View details for ${project.title}`}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-black/20"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) {
          return;
        }

        openProjectDetail();
      }}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      <div className="aspect-[16/10] overflow-hidden border-b border-black/10 bg-gray-100">
        {project.imageUrl ? (
          // img dipakai karena gambar project berasal dari backend dan dapat memakai URL eksternal.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={`${project.title} preview`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={project.imageUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-heading text-5xl font-bold text-gray-300">
            {project.title.trim().charAt(0).toUpperCase() || "P"}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-black">{project.title}</h3>
          {project.featured ? (
            <span className="shrink-0 rounded-full border border-black/10 bg-black px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
              Featured
            </span>
          ) : null}
        </div>
        <div className="mt-4">
          <TechTags items={project.techStack.slice(0, 5)} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {project.demoUrl ? (
            <a
              className="rounded-full bg-black px-3.5 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              href={project.demoUrl}
              rel="noreferrer"
              target="_blank"
            >
              View web
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:bg-gray-50 hover:text-black"
              href={project.repoUrl}
              rel="noreferrer"
              target="_blank"
            >
              View source
            </a>
          ) : null}
          <Link
            className="rounded-full border border-black/10 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:bg-gray-50 hover:text-black"
            href={detailPath}
          >
            View detail
          </Link>
        </div>
      </div>
    </article>
  );
}
