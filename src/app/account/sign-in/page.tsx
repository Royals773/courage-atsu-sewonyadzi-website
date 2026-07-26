import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/shared/page-header";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account.",
};

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/account/orders");

  return (
    <>
      <PageHeader eyebrow="Account" title="Sign in" />
      <div className="mx-auto max-w-sm px-4 py-14 sm:px-6 lg:px-8">
        <SignInForm />
      </div>
    </>
  );
}
