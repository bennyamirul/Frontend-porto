import { ExperienceForm } from "@/components/admin/ExperienceForm";

/**
 * Merender form edit experience berdasarkan ID dari URL.
 * Dipakai route /admin/experience/[id]/edit dan submit-nya dikirim ke PUT /api/admin/experience/:id.
 */
export default async function EditExperiencePage({ params }: PageProps<"/admin/experience/[id]/edit">) {
  const { id } = await params;

  return <ExperienceForm mode="edit" experienceId={Number(id)} />;
}
