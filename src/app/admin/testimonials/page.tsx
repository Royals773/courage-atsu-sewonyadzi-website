import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getAdminTestimonials } from "@/lib/admin/testimonials/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialDialog } from "@/components/admin/testimonials/testimonial-dialog";
import { DeleteTestimonialButton } from "@/components/admin/testimonials/delete-testimonial-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  await requireAdmin("editor");
  const testimonials = await getAdminTestimonials();

  return (
    <>
      <AdminPageHeader
        title="Testimonials"
        description="Only approved testimonials appear publicly."
        action={
          <TestimonialDialog
            trigger={
              <Button>
                <Plus className="size-4" aria-hidden="true" />
                Add testimonial
              </Button>
            }
          />
        }
      />

      {testimonials.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="max-w-72 truncate">{testimonial.quote}</TableCell>
                <TableCell>{testimonial.author_name}</TableCell>
                <TableCell>{testimonial.category}</TableCell>
                <TableCell className="space-x-1">
                  {testimonial.is_approved ? (
                    <Badge>Approved</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                  {testimonial.is_featured ? <Badge variant="secondary">Featured</Badge> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TestimonialDialog
                      testimonial={testimonial}
                      trigger={
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <DeleteTestimonialButton id={testimonial.id} />
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
