import { getAllUsers } from '@/app/actions/admin-users';
import UserTable from '@/components/users/UserTable';
import HomeButton from '@/components/ui/HomeButton';

export default async function AdminUsersPage() {
  const { users } = await getAllUsers();
  // Map users to ensure 'name' is always a string
  const safeUsers = (users || []).map((user: any) => ({
    ...user,
    name: user.name ?? '',
  }));

  return (
        <div className="p-8">
      <HomeButton />
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <UserTable users={safeUsers} />
    </div>
  );
} 