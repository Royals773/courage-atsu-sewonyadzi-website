import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminUsers } from "@/lib/admin/users/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { GrantRoleForm } from "@/components/admin/users/grant-role-form";
import { RevokeRoleButton } from "@/components/admin/users/revoke-role-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Admin Users" };

export default async function AdminUsersPage() {
  const session = await requireAdmin("super_admin");
  const admins = await getAdminUsers();

  return (
    <>
      <AdminPageHeader
        title="Admin users"
        description="Grant or revoke admin access. The user must already have a registered account."
      />

      <div className="mb-6">
        <GrantRoleForm />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.userId}>
              <TableCell className="font-medium">{admin.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{admin.role.replace("_", " ")}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {admin.userId !== session.userId ? (
                  <RevokeRoleButton userId={admin.userId} />
                ) : (
                  <span className="text-xs text-muted-foreground">You</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
