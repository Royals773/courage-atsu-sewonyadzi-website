"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { signUpAction } from "@/lib/auth/actions";
import { initialAuthActionState } from "@/lib/auth/action-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialAuthActionState);

  if (state.info) {
    return (
      <p className="rounded-md bg-secondary px-4 py-3 text-sm text-foreground" role="status">
        {state.info}
      </p>
    );
  }

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
          autoComplete="new-password"
          className="mt-1.5"
        />
        {state.fieldErrors?.password ? (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.password}</p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1.5"
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="mt-1 text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPending}
        aria-label={isPending ? "Creating account…" : undefined}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : "Create Account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/account/sign-in" className="font-medium text-foreground underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
