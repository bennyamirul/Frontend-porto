import { ExperienceForm } from "@/components/admin/ExperienceForm";

/**
 * Merender form tambah experience.
 * Dipakai route /admin/experience/new dan submit-nya dikirim ke POST /api/admin/experience.
 */
export default function NewExperiencePage() {
  return <ExperienceForm mode="create" />;
}
