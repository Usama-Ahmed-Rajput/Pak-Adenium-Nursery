import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin Portal | Pak Adenium Nursery",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // If this is the login page, don't show the sidebar or redirect
  // Note: we can also check if child is login or let login page handle its own layout
  return (
    <div className="min-h-screen bg-ivory">
      {session ? (
        <div className="flex flex-col lg:flex-row min-h-screen">
          <AdminSidebar userEmail={session.email} />
          <div className="flex-1 min-w-0 lg:pl-64 flex flex-col min-h-screen">
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen">{children}</div>
      )}
    </div>
  );
}

