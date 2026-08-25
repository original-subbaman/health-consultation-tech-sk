import type { Metadata } from "next";
import Link from "next/link";
import { PatientLoginForm } from "./patient-login-form";

export const metadata: Metadata = {
  title: "Patient sign in | Serene Health",
  description: "Sign in to your Serene Health patient account.",
};

export default function PatientLoginPage() {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-ambient sm:p-9">
      <div>
        <p className="text-label-md text-primary">PATIENT PORTAL</p>
        <h2 className="mt-2 text-headline-lg text-on-surface">Welcome back</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Sign in to manage your consultations and care.
        </p>
      </div>

      <PatientLoginForm />

      <p className="mt-7 text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/patient/register" className="font-semibold text-primary transition hover:text-primary-container hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
