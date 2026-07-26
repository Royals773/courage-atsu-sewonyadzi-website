import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminPressItems } from "@/lib/admin/press/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PressItemDialog } from "@/components/admin/press/press-item-dialog";
import { DeletePressItemButton } from "@/components/admin/press/delete-press-item-button";

export const metadata: Metadata = { title: "Press" };

export default async function AdminPressPage() {
  await requireAdmin("editor");
  const items = await getAdminPressItems();

  return (
    <>
      <AdminPageHeader
        title="Press"
        description="Interviews, podcasts, publications, videos and press releases."
        action={
          <PressItemDialog
            trigger={
              <Button>
                <Plus className="size-4" aria-hidden="true" />
                Add Press Item
              </Button>
            }
          />
        }
      />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No press items yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.type.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>{item.is_published ? "Yes" : "Draft"}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <PressItemDialog item={item} trigger={<Button variant="outline" size="sm">Edit</Button>} />
                  <DeletePressItemButton id={item.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
