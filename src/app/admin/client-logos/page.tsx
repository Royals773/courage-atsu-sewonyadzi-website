import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminClientLogos } from "@/lib/admin/client-logos/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientLogoUploadForm } from "@/components/admin/client-logos/client-logo-upload-form";
import { ClientLogoDialog } from "@/components/admin/client-logos/client-logo-dialog";
import { DeleteClientLogoButton } from "@/components/admin/client-logos/delete-client-logo-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Client Logos" };

export default async function AdminClientLogosPage() {
  await requireAdmin("editor");
  const logos = await getAdminClientLogos();

  return (
    <>
      <AdminPageHeader
        title="Client Logos"
        description="Organisations shown in the homepage 'Trusted by' strip. The section is hidden entirely until at least one logo is published here."
      />

      <ClientLogoUploadForm />

      {logos.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No client logos yet.</p>
      ) : (
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logos.map((logo) => (
              <TableRow key={logo.id}>
                <TableCell className="font-medium">{logo.name}</TableCell>
                <TableCell className="text-muted-foreground">{logo.website_url ?? "—"}</TableCell>
                <TableCell>{logo.position}</TableCell>
                <TableCell>{logo.is_published ? "Yes" : "Draft"}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <ClientLogoDialog logo={logo} trigger={<Button variant="outline" size="sm">Edit</Button>} />
                  <DeleteClientLogoButton id={logo.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
