// Auto-redirect /admin -> /admin/users
import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { redirect } from 'next/navigation';


export default async function AdminDashboardPage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "ADMIN") {
    redirect('/not-authorized');
  }
  redirect('/admin/users');
}
