import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/components/admin-auth-provider";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "PSI Admin",
  description: "PSI Publications administration",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
