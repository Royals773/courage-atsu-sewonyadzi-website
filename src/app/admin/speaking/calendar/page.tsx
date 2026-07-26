import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/auth";
import { getCalendarEntries } from "@/lib/admin/speaking/calendar/queries";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SpeakingCalendar } from "@/components/admin/speaking/speaking-calendar";

export const metadata: Metadata = { title: "Availability Calendar" };

export default async function AdminSpeakingCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  await requireAdmin("administrator");
  const { year: yearParam, month: monthParam } = await searchParams;

  const now = new Date();
  const year = yearParam ? Number(yearParam) : now.getFullYear();
  const month = monthParam ? Number(monthParam) - 1 : now.getMonth();

  const start = new Date(year, month, 1).toISOString().slice(0, 10);
  const end = new Date(year, month + 1, 0).toISOString().slice(0, 10);
  const entries = await getCalendarEntries(start, end);

  return (
    <>
      <AdminPageHeader
        title="Availability Calendar"
        description="Block, reserve or confirm dates. Click a day to manage it."
      />
      <SpeakingCalendar year={year} month={month} entries={entries} />
    </>
  );
}
