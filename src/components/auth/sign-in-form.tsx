"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { signInAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" className="mt-1.5" />
        {state.fieldErrors?.email ? (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.email}</p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="mt-1.5"
        />
        {state.fieldErrors?.password ? (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.password}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPending}
        aria-label={isPending ? "Signing in…" : undefined}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Sign In"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/account/sign-up" className="font-medium text-foreground underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
