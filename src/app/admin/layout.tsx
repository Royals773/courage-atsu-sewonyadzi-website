import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getSettingGroup } from "@/lib/settings/queries";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, brand] = await Promise.all([requireAdmin(), getSettingGroup("brand")]);

  return (
    <AdminShell session={session} brandName={brand.displayName}>
      {children}
    </AdminShell>
  );
}
