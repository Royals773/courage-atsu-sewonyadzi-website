"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Subscriber {
  email: string;
  first_name: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
  tags: string[];
}

function toCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ExportCsvButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const header = ["email", "first_name", "subscribed_at", "unsubscribed_at", "tags"];
    const rows = subscribers.map((s) =>
      [
        s.email,
        s.first_name ?? "",
        s.subscribed_at,
        s.unsubscribed_at ?? "",
        s.tags.join("|"),
      ]
        .map(toCsvValue)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="size-4" aria-hidden="true" />
      Export CSV
    </Button>
  );
}
