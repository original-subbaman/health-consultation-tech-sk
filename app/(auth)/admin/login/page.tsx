import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "./admin-login-form";

export const metadata: Metadata = {
  title: "Admin sign in | Serene Health",
  description: "Sign in to the Serene Health administration portal.",
};

export default function AdminLoginPage() {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-ambient sm:p-9">
      <div>
        <p className="text-label-md text-primary">ADMIN PORTAL</p>
        <h2 className="mt-2 text-headline-lg text-on-surface">Welcome back</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Sign in to manage the Serene Health platform.
        </p>
      </div>

      <AdminLoginForm />

      <p className="mt-7 text-center text-sm text-on-surface-variant">
        Looking for the patient portal?{" "}
        <Link
          href="/patient/login"
          className="font-semibold text-primary transition hover:text-primary-container hover:underline"
        >
          Patient sign in
        </Link>
      </p>
    </div>
  );
}
