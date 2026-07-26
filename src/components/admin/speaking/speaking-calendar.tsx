"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { clearCalendarEntryAction, setCalendarEntryAction } from "@/lib/admin/speaking/calendar/actions";
import type { SpeakingCalendarStatus } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CalendarEntry {
  entry_date: string;
  status: SpeakingCalendarStatus;
  note: string | null;
  speaking_events: { client: string; event_date: string } | null;
}

const STATUS_STYLES: Record<SpeakingCalendarStatus, string> = {
  blocked: "bg-muted text-muted-foreground",
  reserved: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  confirmed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
};

const STATUS_LABELS: Record<SpeakingCalendarStatus, string> = {
  blocked: "Blocked",
  reserved: "Reserved",
  confirmed: "Confirmed",
};

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function SpeakingCalendar({
  year,
  month,
  entries,
}: {
  year: number;
  month: number; // 0-indexed
  entries: CalendarEntry[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<SpeakingCalendarStatus>("blocked");
  const [note, setNote] = useState("");

  const entriesByDate = new Map(entries.map((e) => [e.entry_date, e]));

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  function goToMonth(offset: number) {
    const d = new Date(year, month + offset, 1);
    router.push(`/admin/speaking/calendar?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  }

  function openDay(dateKey: string) {
    const existing = entriesByDate.get(dateKey);
    setSelectedDate(dateKey);
    setStatus(existing?.status ?? "blocked");
    setNote(existing?.note ?? "");
  }

  function handleSave() {
    if (!selectedDate) return;
    startTransition(async () => {
      try {
        await setCalendarEntryAction(selectedDate, status, note);
        toast.success("Calendar updated");
        setSelectedDate(null);
      } catch (error) {
        toast.error("Couldn't update calendar", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  function handleClear() {
    if (!selectedDate) return;
    startTransition(async () => {
      try {
        await clearCalendarEntryAction(selectedDate);
        toast.success("Date cleared");
        setSelectedDate(null);
      } catch (error) {
        toast.error("Couldn't clear date", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  const monthLabel = firstDay.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const selectedEntry = selectedDate ? entriesByDate.get(selectedDate) : undefined;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon-sm" onClick={() => goToMonth(-1)} aria-label="Previous month">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>
        <h2 className="font-heading text-lg font-semibold">{monthLabel}</h2>
        <Button variant="outline" size="icon-sm" onClick={() => goToMonth(1)} aria-label="Next month">
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = new Date(year, month, i + 1);
          const dateKey = toDateKey(date);
          const entry = entriesByDate.get(dateKey);
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => openDay(dateKey)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md border border-border text-sm hover:border-foreground/40",
                entry ? STATUS_STYLES[entry.status] : "bg-background"
              )}
            >
              <span>{i + 1}</span>
              {entry?.speaking_events ? (
                <span className="truncate px-1 text-[10px]">{entry.speaking_events.client}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(Object.keys(STATUS_LABELS) as SpeakingCalendarStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm", STATUS_STYLES[s])} />
            {STATUS_LABELS[s]}
          </span>
        ))}
      </div>

      <Dialog open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDate}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as SpeakingCalendarStatus)}>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as SpeakingCalendarStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="calendar-note">Note</Label>
              <Textarea id="calendar-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1.5" />
            </div>
            {selectedEntry?.speaking_events ? (
              <p className="text-xs text-muted-foreground">
                Linked to event: {selectedEntry.speaking_events.client}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            {selectedEntry ? (
              <Button variant="outline" disabled={isPending} onClick={handleClear}>
                Clear date
              </Button>
            ) : null}
            <Button disabled={isPending} onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
