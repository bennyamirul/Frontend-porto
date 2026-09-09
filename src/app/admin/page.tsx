import { AdminDashboard } from "@/components/admin/AdminDashboard";

/**
 * Merender dashboard admin protected.
 * Dipakai route /admin; proteksi dilakukan di komponen client dengan request ke endpoint admin yang mengembalikan 401 jika cookie tidak valid.
 */
export default function AdminPage() {
  return <AdminDashboard />;
}
