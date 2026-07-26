"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import type { AdminSession } from "@/lib/admin/role";
import { AdminNavLinks } from "@/components/admin/admin-nav-links";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ROLE_LABELS: Record<AdminSession["role"], string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  editor: "Editor",
};

export function AdminShell({
  session,
  brandName,
  children,
}: {
  session: AdminSession;
  brandName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px]">
      <aside className="hidden w-64 shrink-0 border-r border-border p-4 lg:block">
        <Link href="/admin" className="font-heading text-lg font-semibold">
          {brandName} Admin
        </Link>
        <Badge variant="secondary" className="mt-2">
          {ROLE_LABELS[session.role]}
        </Badge>
        <div className="mt-6">
          <AdminNavLinks session={session} />
        </div>
        <div className="mt-8 border-t border-border pt-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
          <span className="font-heading text-base font-semibold">
            {brandName} Admin
          </span>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Open admin menu" />}>
              <Menu aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>{brandName} Admin</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-4">
                <Badge variant="secondary">{ROLE_LABELS[session.role]}</Badge>
                <div className="mt-4">
                  <AdminNavLinks session={session} onNavigate={() => setOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
