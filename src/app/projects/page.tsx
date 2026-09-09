"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StateMessage } from "@/components/StateMessage";
import { getProjects, type Project } from "@/lib/api";

/**
 * Menampilkan seluruh project dari backend dalam bentuk grid.
 * Dipakai route "/projects" dan fetch dilakukan lewat helper agar error koneksi API tetap konsisten.
 */
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Memuat daftar project saat halaman pertama kali dirender di browser.
     * useEffect dipakai supaya UI bisa menampilkan loading sebelum response backend diterima.
     */
    async function loadProjects() {
      try {
        setProjects(await getProjects());
      } catch {
        setError("Daftar project belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          description=""
          eyebrow="Projects"
          title="A Practical Archive of Shipped Work."
        />
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <StateMessage
            message="Sebentar, saya sedang menyiapkan daftar project."
            title="Loading projects"
          />
        ) : error ? (
          <StateMessage message={error} title="Projects unavailable" />
        ) : projects.length > 0 ? (
          projects.map((project, index) => (
            <Reveal delay={index * 0.04} key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))
        ) : (
          <StateMessage
            message="Belum ada project yang bisa ditampilkan."
            title="No projects found"
          />
        )}
      </div>
    </section>
  );
}
