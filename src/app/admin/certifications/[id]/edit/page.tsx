import { CertificationForm } from "@/components/admin/CertificationForm";

type EditCertificationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCertificationPage({
  params,
}: EditCertificationPageProps) {
  const { id } = await params;

  return <CertificationForm certificationId={Number(id)} mode="edit" />;
}
