import type { Metadata } from "next";
import Link from "next/link";
import { PatientRegistrationForm } from "./patient-registration-form";

export const metadata: Metadata = {
  title: "Create a patient account | Serene Health",
  description: "Create your Serene Health patient account.",
};

export default function PatientRegisterPage() {
  return (
    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-ambient">
      <div>
        <p className="text-label-md text-primary">PATIENT REGISTRATION</p>
        <h2 className="mt-2 text-headline-lg text-on-surface">Create your account</h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Tell us a little about yourself to get started.
        </p>
      </div>

      <PatientRegistrationForm />

      <p className="mt-7 text-center text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link
          href="/patient/login"
          className="font-semibold text-primary transition hover:text-primary-container hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
