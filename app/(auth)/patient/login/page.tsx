import type { Metadata } from "next";
import Link from "next/link";

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

      <form className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-label-md text-on-surface">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary-fixed/60"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="text-label-md text-on-surface">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-primary transition hover:text-primary-container hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            placeholder="Enter your password"
            className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary-fixed/60"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-ambient transition hover:-translate-y-0.5 hover:shadow-ambient-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Sign in
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link href="/patient/register" className="font-semibold text-primary transition hover:text-primary-container hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
