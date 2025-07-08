import React from "react";
import Link from "next/link";

const AdminSidebar = () => (
  <aside className="hidden md:fixed md:flex flex-col w-64 h-screen bg-gray-900 text-white p-4">
    <div className="text-2xl font-bold mb-8">Admin</div>
    <nav className="flex flex-col gap-4">
      <Link href="/admin/users" className="hover:bg-gray-800 rounded px-3 py-2">
        Users
      </Link>
      <Link
        href="/admin/vendors"
        className="hover:bg-gray-800 rounded px-3 py-2"
      >
        Vendors
      </Link>
      <Link
        href="/admin/products"
        className="hover:bg-gray-800 rounded px-3 py-2"
      >
        Products
      </Link>
      <Link
        href="/admin/categories"
        className="hover:bg-gray-800 rounded px-3 py-2"
      >
        Categories
      </Link>
      <Link href="/profile" className="hover:bg-gray-800 rounded px-3 py-2">
        Profile
      </Link>
    </nav>
  </aside>
);

import { getSessionFromCookie } from "@/app/actions/auth/get-session";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || session.role !== "ADMIN") {
    redirect("/not-authorized");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 md:ml-64">{children}</main>
    </div>
  );
}
