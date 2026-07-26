import type { AdminRole } from "@/lib/supabase/database.types";

export interface AdminNavItem {
  label: string;
  href: string;
  minRole: AdminRole;
}

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", minRole: "editor" },
  { label: "Books", href: "/admin/books", minRole: "administrator" },
  { label: "Blog", href: "/admin/blog", minRole: "editor" },
  { label: "Media Library", href: "/admin/media", minRole: "editor" },
  { label: "Testimonials", href: "/admin/testimonials", minRole: "editor" },
  { label: "FAQs", href: "/admin/faqs", minRole: "editor" },
  { label: "Speaking Topics", href: "/admin/speaking/topics", minRole: "editor" },
  { label: "Speaking Enquiries", href: "/admin/speaking/enquiries", minRole: "editor" },
  { label: "Availability Calendar", href: "/admin/speaking/calendar", minRole: "administrator" },
  { label: "Speaking Events", href: "/admin/speaking/events", minRole: "administrator" },
  { label: "Press", href: "/admin/press", minRole: "editor" },
  { label: "Video Library", href: "/admin/videos", minRole: "editor" },
  { label: "Client Logos", href: "/admin/client-logos", minRole: "editor" },
  { label: "Orders", href: "/admin/orders", minRole: "administrator" },
  { label: "Customers", href: "/admin/customers", minRole: "administrator" },
  { label: "Newsletter", href: "/admin/newsletter", minRole: "administrator" },
  { label: "Settings", href: "/admin/settings", minRole: "administrator" },
  { label: "Admin Users", href: "/admin/users", minRole: "super_admin" },
];
