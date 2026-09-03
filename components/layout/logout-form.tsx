"use client";
import { logout } from "@/actions/auth";
import { LogOut } from "lucide-react";
import { Button, Form } from "react-aria-components";

export default function LogoutForm() {
  return (
    <Form action={logout}>
      <Button
        type="submit"
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-bold text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high hover:text-on-surface"
      >
        <LogOut aria-hidden="true" className="size-5" />
        <span>Sign Out</span>
      </Button>
    </Form>
  );
}
