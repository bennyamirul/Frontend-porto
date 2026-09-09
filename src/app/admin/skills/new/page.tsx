import { SkillForm } from "@/components/admin/SkillForm";

/**
 * Merender form tambah skill.
 * Dipakai route /admin/skills/new dan submit-nya dikirim ke POST /api/admin/skills.
 */
export default function NewSkillPage() {
  return <SkillForm mode="create" />;
}
