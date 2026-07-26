import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminFaqs } from "@/lib/admin/faqs/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqDialog } from "@/components/admin/faqs/faq-dialog";
import { DeleteFaqButton } from "@/components/admin/faqs/delete-faq-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage() {
  await requireAdmin("editor");
  const faqs = await getAdminFaqs();

  return (
    <>
      <AdminPageHeader
        title="FAQs"
        action={
          <FaqDialog
            trigger={
              <Button>
                <Plus className="size-4" aria-hidden="true" />
                Add FAQ
              </Button>
            }
          />
        }
      />

      {faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No FAQs yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-96 truncate">{faq.question}</TableCell>
                <TableCell>{faq.category.replace(/-/g, " ")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <FaqDialog
                      faq={faq}
                      trigger={
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <DeleteFaqButton id={faq.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
