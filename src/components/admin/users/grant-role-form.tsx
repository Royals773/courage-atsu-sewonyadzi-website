"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { grantAdminRoleAction } from "@/lib/admin/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GrantRoleForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await grantAdminRoleAction(formData);
        toast.success("Role granted");
      } catch (error) {
        toast.error("Couldn't grant role", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <Label htmlFor="email">Email of an existing account</Label>
        <Input id="email" name="email" type="email" required className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue="editor">
          <SelectTrigger id="role" className="mt-1.5 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Grant role"}
      </Button>
    </form>
  );
}
