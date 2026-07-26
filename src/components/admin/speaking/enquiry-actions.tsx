"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  convertEnquiryToEventAction,
  updateEnquiryAdminNotesAction,
  updateEnquiryStatusAction,
} from "@/lib/admin/speaking/enquiries/actions";
import { ENQUIRY_STATUSES } from "@/lib/admin/speaking/enquiries/constants";
import type { SpeakingEnquiryStatus } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_LABELS: Record<SpeakingEnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  discovery: "Discovery",
  proposal_sent: "Proposal Sent",
  negotiating: "Negotiating",
  confirmed: "Confirmed",
  delivered: "Delivered",
  closed: "Closed",
};

export function EnquiryActions({
  enquiryId,
  status,
  adminNotes,
}: {
  enquiryId: string;
  status: SpeakingEnquiryStatus;
  adminNotes: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(adminNotes ?? "");

  function handleStatusChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      try {
        await updateEnquiryStatusAction(enquiryId, value as SpeakingEnquiryStatus);
        toast.success("Status updated");
      } catch (error) {
        toast.error("Couldn't update status", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleSaveNotes() {
    startTransition(async () => {
      try {
        await updateEnquiryAdminNotesAction(enquiryId, notes);
        toast.success("Notes saved");
      } catch (error) {
        toast.error("Couldn't save notes", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleConvert() {
    startTransition(async () => {
      try {
        await convertEnquiryToEventAction(enquiryId);
      } catch (error) {
        toast.error("Couldn't create event", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENQUIRY_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="admin_notes">Internal notes</Label>
          <Textarea
            id="admin_notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mt-1.5"
          />
          <Button variant="outline" size="sm" className="mt-2" disabled={isPending} onClick={handleSaveNotes}>
            Save notes
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <Button disabled={isPending} onClick={handleConvert}>
            Convert to Event
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Creates a speaking event record pre-filled from this enquiry and marks it confirmed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
