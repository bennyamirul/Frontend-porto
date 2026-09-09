"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Experience } from "@/lib/api";
import { formatMonthYear } from "@/lib/format";

type ExperienceCardProps = {
  experience: Experience;
};

/**
 * Menampilkan satu experience sebagai ringkasan yang bisa dibuka untuk membaca detail.
 * Dipakai home dan halaman "/experience" agar pola expand/collapse konsisten di semua preview timeline.
 */
export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateRange = `${formatMonthYear(experience.startDate)} - ${formatMonthYear(experience.endDate)}`;
  const detailsId = `experience-details-${experience.id}`;

  return (
    <article className="grid gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-black/20 md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="order-2 md:order-1">
        <div className="flex items-center gap-4">
          {experience.imageUrl ? (
            // img dipakai karena URL gambar instansi berasal dari backend dan dapat memakai domain eksternal.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${experience.company} logo`}
              className="h-16 w-16 shrink-0 rounded-2xl border border-black/10 object-cover"
              src={experience.imageUrl}
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-gray-100 font-mono text-2xl font-semibold text-black">
              {experience.company.trim().charAt(0).toUpperCase() || "I"}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-black">
              {experience.role}
            </h2>
            <p className="mt-1 text-gray-600">{experience.company}</p>
          </div>
        </div>
        <p className="mt-5 text-sm font-medium text-gray-700">
          {experience.location || "Location not specified"}
        </p>
        <button
          aria-controls={detailsId}
          aria-expanded={isExpanded}
          className="mt-5 rounded-full border border-black/10 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:bg-gray-50 hover:text-black"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
          type="button"
        >
          {isExpanded ? "Show less" : "Show details"}
        </button>
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
              exit={{ height: 0, opacity: 0 }}
              id={detailsId}
              initial={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="pt-4 leading-8 text-gray-700">
                {experience.description}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="order-1 font-mono text-right text-sm text-gray-500 md:order-2">
        {dateRange}
      </div>
    </article>
  );
}
