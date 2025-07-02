import React from 'react';
import Link from 'next/link';
import { getSessionFromCookie } from '@/app/actions/get-session';
import { redirect } from 'next/navigation';

const VendorSidebar = () => (
  <aside className="hidden md:fixed md:flex flex-col w-64 h-screen bg-gray-900 text-white p-4">
    <div className="text-2xl font-bold mb-8">Vendor</div>
    <nav className="flex flex-col gap-4">
      <Link href="/vendor/products" className="hover:bg-gray-800 rounded px-3 py-2">Products</Link>
      <Link href="/vendor/orders" className="hover:bg-gray-800 rounded px-3 py-2">Orders</Link>
      <Link href="/profile" className="hover:bg-gray-800 rounded px-3 py-2">Profile</Link>
    </nav>
  </aside>
);

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== 'object' || session.role !== 'VENDOR') {
    redirect('/not-authorized');
  }
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <VendorSidebar />
      <main className="flex-1 bg-gray-50 md:ml-64">{children}</main>
    </div>
  );
}
