import { SkillForm } from "@/components/admin/SkillForm";

/**
 * Merender form edit skill berdasarkan ID dari URL.
 * Dipakai route /admin/skills/[id]/edit dan submit-nya dikirim ke PUT /api/admin/skills/:id.
 */
export default async function EditSkillPage({
  params,
}: PageProps<"/admin/skills/[id]/edit">) {
  const { id } = await params;

  return <SkillForm mode="edit" skillId={Number(id)} />;
}
