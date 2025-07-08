import { getSessionFromCookie } from "@/app/actions/auth/get-session";
import { redirect } from "next/navigation";

// Auto-redirect /vendor -> /vendor/products
export default async function VendorDashboardPage() {
  const session = await getSessionFromCookie();
  if (!session || typeof session !== "object" || !("role" in session) || session.role !== "VENDOR") {
    redirect("/not-authorized");
  }
  redirect('/vendor/products');
}
