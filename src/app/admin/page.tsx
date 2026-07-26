import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { formatPrice } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Revenue", value: formatPrice(stats.revenue) },
    { label: "Total Book Sales", value: stats.totalBookSales.toLocaleString() },
    { label: "Orders", value: stats.orderCount.toLocaleString(), href: "/admin/orders" },
    { label: "Customers", value: stats.customerCount.toLocaleString(), href: "/admin/customers" },
    {
      label: "Newsletter Subscribers",
      value: stats.newsletterSubscriberCount.toLocaleString(),
      href: "/admin/newsletter",
    },
    {
      label: "Speaking Enquiries",
      value: stats.speakingEnquiryCount.toLocaleString(),
      href: "/admin/speaking/enquiries",
    },
    {
      label: "Published Blog Posts",
      value: stats.publishedPostCount.toLocaleString(),
      href: "/admin/blog",
    },
    { label: "Books in Catalogue", value: stats.bookCount.toLocaleString(), href: "/admin/books" },
  ];

  const pendingActions = [
    { label: "Orders awaiting fulfilment", count: stats.pendingOrders, href: "/admin/orders?status=pending" },
    {
      label: "Testimonials awaiting approval",
      count: stats.unapprovedTestimonials,
      href: "/admin/testimonials",
    },
    { label: "Formats low or out of stock", count: stats.lowOrOutOfStockFormats, href: "/admin/books" },
    {
      label: "New speaking enquiries",
      count: stats.newSpeakingEnquiries,
      href: "/admin/speaking/enquiries?status=new",
    },
  ].filter((action) => action.count > 0);

  return (
    <>
      <AdminPageHeader title="Dashboard" description="An overview of the store and site." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const content = (
            <CardContent>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-heading text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              <Card className="h-full transition-shadow hover:shadow-md">{content}</Card>
            </Link>
          ) : (
            <Card key={stat.label} className="h-full">
              {content}
            </Card>
          );
        })}
      </div>

      {pendingActions.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold">Pending actions</h2>
          <div className="mt-3 space-y-2">
            {pendingActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3">
                    <AlertTriangle className="size-4 text-gold" aria-hidden="true" />
                    <span className="flex-1 text-sm">{action.label}</span>
                    <span className="font-heading text-sm font-semibold">{action.count}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
