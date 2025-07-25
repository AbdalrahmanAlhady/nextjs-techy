import { redirect } from 'next/navigation';
import Layout from '@/components/Layout';
import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { db } from '@/packages/db';
import { users } from '@/packages/db/schema';
import { eq } from 'drizzle-orm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import UserOrdersList from './UserOrdersList';
import { getBuyerOrdersWithItems } from '@/app/actions/buyer/orders';

export default async function ProfilePage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || !('id' in session)) {
    redirect('/sign-in');
  }
  const userId = (session as any).id;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0]);

  if (!user) {
    redirect('/sign-in');
  }

  // Fetch orders for the logged-in user, including items
  const ordersResult = await getBuyerOrdersWithItems();
  const orders = ordersResult.success && Array.isArray(ordersResult.orders)
    ? ordersResult.orders.map((o: any) => ({
        id: o.id,
        createdAt: o.createdAt,
        status: o.status,
        total: o.total,
        shippingCost: o.shippingCost,
        shippingAddress: o.shippingAddress,
        items: o.items || [],
      }))
    : [];

  const createdAt = user.createdAt ? new Date(user.createdAt as unknown as string).toLocaleDateString() : 'N/A';

  // Prepare display helpers
  const initials = (user.name ?? user.email ?? 'U')
    .split(' ')[0]
    .slice(0, 2)
    .toUpperCase();

  const statusClasses =
    user.vendorStatus === 'APPROVED'
      ? 'bg-green-100 text-green-800'
      : user.vendorStatus === 'PENDING'
      ? 'bg-yellow-100 text-yellow-800'
      : user.vendorStatus === 'REJECTED'
      ? 'bg-red-100 text-red-800'
      : 'bg-gray-100 text-gray-800';

  return (
  <Layout>
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Tabs defaultValue="personal" className="mt-8">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          {/* Personal Info Card */}
          <div className="rounded-xl border border-border p-8 bg-white shadow-sm flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {initials}
            </div>
            {/* Info */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-2">Account Details</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-neutral-700">
                  <dt className="font-medium">Name</dt>
                  <dd>{user.name || 'N/A'}</dd>
                  <dt className="font-medium">Email</dt>
                  <dd>{user.email}</dd>
                  {user.role !== 'BUYER' && (
                    <>
                      <dt className="font-medium">Role</dt>
                      <dd>{user.role}</dd>
                    </>
                  )}
                  <dt className="font-medium">Created</dt>
                  <dd>{createdAt}</dd>
                  <dt className="font-medium">Vendor Status</dt>
                  <dd>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusClasses}`}>
                      {user.vendorStatus}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <h2 className="text-lg font-semibold mb-4">Order History</h2>
          {/* Card-based order history */}
          {/* We'll use a simple expandable list pattern */}
          <UserOrdersList orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  </Layout>
);
}
