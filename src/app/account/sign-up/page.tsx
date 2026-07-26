import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a customer account.",
};

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account/orders");

  return (
    <>
      <PageHeader eyebrow="Account" title="Create an account" />
      <div className="mx-auto max-w-sm px-4 py-14 sm:px-6 lg:px-8">
        <SignUpForm />
      </div>
    </>
  );
}
