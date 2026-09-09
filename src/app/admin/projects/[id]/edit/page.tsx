import { ProjectForm } from "@/components/admin/ProjectForm";

/**
 * Merender form edit project berdasarkan ID dari URL.
 * Dipakai route /admin/projects/[id]/edit dan submit-nya dikirim ke PUT /api/admin/projects/:id.
 */
export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;

  return <ProjectForm mode="edit" projectId={Number(id)} />;
}
