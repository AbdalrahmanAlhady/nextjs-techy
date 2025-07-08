import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/app/actions/auth/get-session';
import { db } from '@/packages/db';
import { users } from '@/packages/db/schema';
import { eq } from 'drizzle-orm';
import { applyForVendorStatus } from '@/app/actions/vendor/application';
import TechyButton from '@/components/TechyButton';
import Layout from '@/components/Layout';

export default async function VendorApplicationPage() {
  // Get the current session
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || !('id' in session)) {
    redirect('/sign-in');
  }
  const userId = (session as any).id;
  // Fetch the current user from DB
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .then((res) => res[0]);
  if (!user) {
    redirect('/sign-in');
  }

  let content: React.ReactNode = null;
  switch (user.vendorStatus) {
    case 'PENDING':
      content = (
        <div className="rounded-md bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 mb-4">
          Your vendor application is <b>pending review</b>.
        </div>
      );
      break;
    case 'APPROVED':
      content = (
        <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 mb-4">
          <b>Congratulations!</b> You are an approved vendor!
        </div>
      );
      break;
    case 'REJECTED':
      content = (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 mb-4">
          Your vendor application was <b>rejected</b>. Contact support for details.
        </div>
      );
      break;
    case 'NONE':
    default:
      content = (
        <form action={applyForVendorStatus}>
          <TechyButton type="submit" variant="primary" size="lg" className="w-full">
            Apply to Become a Vendor
          </TechyButton>
        </form>
      );
      break;
  }

  return (
    <Layout>
      <div className="max-w-lg mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Vendor Application</h1>

      {/* Status Card */}
      <div className="rounded-lg border border-border p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Current Status</h2>
        <div className="flex items-center space-x-3">
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              user.vendorStatus === 'APPROVED'
                ? 'bg-green-100 text-green-800'
                : user.vendorStatus === 'PENDING'
                ? 'bg-blue-100 text-blue-800'
                : user.vendorStatus === 'REJECTED'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.vendorStatus}
          </span>
          {user.vendorStatus === 'NONE' && (
            <span className="text-sm text-neutral-600">You have not applied yet.</span>
          )}
          {user.vendorStatus === 'PENDING' && (
            <span className="text-sm text-neutral-600">Your application is being reviewed.</span>
          )}
          {user.vendorStatus === 'APPROVED' && (
            <span className="text-sm text-neutral-600">You are approved and can start selling!</span>
          )}
          {user.vendorStatus === 'REJECTED' && (
            <span className="text-sm text-neutral-600">Application rejected – contact support for details.</span>
          )}
        </div>
      </div>

      {/* Action / Messages */}
      {content}
      </div>
    </Layout>
  );
}
