"use client";

import { useEffect, useState } from "react";
import { ExperienceCard } from "@/components/ExperienceCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StateMessage } from "@/components/StateMessage";
import { getExperiences, type Experience } from "@/lib/api";

/**
 * Menampilkan timeline experience dari backend.
 * Dipakai route "/experience" dengan loading/error state agar masalah GET /api/experience mudah terlihat.
 */
export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Mengambil experience saat halaman dibuka.
     * Data sudah diurutkan backend, jadi frontend cukup merendernya sebagai timeline.
     */
    async function loadExperiences() {
      try {
        setExperiences(await getExperiences());
      } catch {
        setError("Daftar pengalaman belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoading(false);
      }
    }

    loadExperiences();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          description="Perjalanan kerja terbaru saya, disusun dari pengalaman yang paling relevan."
          eyebrow="Experience"
          title="Where product thinking meets delivery."
        />
      </Reveal>
      <div className="mt-10 space-y-4">
        {isLoading ? (
          <StateMessage message="Sebentar, saya sedang menyiapkan timeline pengalaman." title="Loading experience" />
        ) : error ? (
          <StateMessage message={error} title="Experience unavailable" />
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
  );
}
