import { ProjectForm } from "@/components/admin/ProjectForm";

/**
 * Merender form tambah project.
 * Dipakai route /admin/projects/new dan submit-nya dikirim ke POST /api/admin/projects.
 */
export default function NewProjectPage() {
  return <ProjectForm mode="create" />;
}
