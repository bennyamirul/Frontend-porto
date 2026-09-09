"use client";

import { useEffect, useState } from "react";
import { CertificationCard } from "@/components/CertificationCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StateMessage } from "@/components/StateMessage";
import { getCertifications, type Certification } from "@/lib/api";

/**
 * Menampilkan semua certification dari backend sebagai grid publik.
 * Dipakai route "/certificates" dengan loading, error, dan empty state karena data baru bisa saja belum tersedia.
 */
export default function CertificatesPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    /**
     * Mengambil daftar certification saat halaman dibuka.
     * useEffect menjaga request berjalan di browser sehingga state loading/error terlihat oleh pengunjung.
     */
    async function loadCertifications() {
      try {
        setCertifications(await getCertifications());
      } catch {
        setError("Daftar sertifikasi belum bisa ditampilkan saat ini.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCertifications();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal>
        <SectionHeading
          description="Kursus, sertifikasi, dan credential yang sudah saya selesaikan."
          eyebrow="Certificates"
          title="Certifications and credentials."
        />
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <StateMessage message="Sebentar, saya sedang menyiapkan daftar sertifikasi." title="Loading certifications" />
        ) : error ? (
          <StateMessage message={error} title="Certifications unavailable" />
        ) : certifications.length > 0 ? (
          certifications.map((certification, index) => (
            <Reveal delay={index * 0.04} key={certification.id}>
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
    </section>
  );
}
