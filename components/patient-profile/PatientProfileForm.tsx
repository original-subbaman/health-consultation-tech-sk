"use client";

import {
  updatePatientProfileAction,
  type PatientProfileUpdateState,
} from "@/actions/patient";
import type { PatientProfile } from "@/lib/data/patient";
import { useActionState } from "react";

const inputClassName =
  "mt-1 w-full rounded-md border border-outline-variant bg-surface p-3 text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary-fixed/60";

const labelClassName =
  "flex flex-col gap-1 font-label-md text-label-md text-on-surface-variant";

type PatientProfileFormProps = {
  patient: PatientProfile;
};

const initialState: PatientProfileUpdateState = {};

export default function PatientProfileForm({
  patient,
}: PatientProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updatePatientProfileAction,
    initialState,
  );
  const patientInitial = patient.fullName.trim().charAt(0).toUpperCase() || "P";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 rounded-lg border border-surface-variant bg-surface-container-low p-gutter shadow-ambient"
    >
      <div className="flex flex-col items-center gap-6 border-b border-outline-variant pb-6 sm:flex-row">
        <div
          aria-hidden="true"
          className="grid size-20 shrink-0 place-items-center rounded-full border-2 border-primary bg-primary text-headline-lg font-bold text-on-primary"
        >
          {patientInitial}
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <span className="font-headline-md text-headline-md text-on-surface">
            {patient.fullName}
          </span>
          {/* <label className="flex cursor-pointer items-center gap-2 rounded-md border border-primary bg-surface px-4 py-2 font-label-md text-label-md text-primary transition-colors hover:bg-surface-container-high">
            Change avatar
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
            />
          </label> */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className={labelClassName}>
          Full Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={patient.fullName}
            required
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Nickname
          <input
            name="nickname"
            type="text"
            autoComplete="nickname"
            defaultValue={patient.nickname ?? ""}
            placeholder="How should we address you?"
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Weight (kg)
          <input
            name="weight"
            type="number"
            inputMode="decimal"
            min="1"
            max="500"
            step="0.1"
            defaultValue={patient.weight ?? ""}
            placeholder="Enter weight"
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Height (cm)
          <input
            name="height"
            type="number"
            inputMode="decimal"
            min="30"
            max="300"
            step="0.1"
            defaultValue={patient.height ?? ""}
            placeholder="Enter height"
            className={inputClassName}
          />
        </label>

        <label className={labelClassName}>
          Sex
          <select
            name="sex"
            defaultValue={patient.gender}
            required
            className={inputClassName}
          >
            <option value="" disabled>
              Select sex
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="intersex">Intersex</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </label>

        <label className={labelClassName}>
          Date of Birth (DOB)
          <input
            name="dob"
            type="date"
            autoComplete="bday"
            defaultValue={patient.dob}
            required
            className={inputClassName}
          />
        </label>
      </div>

      <fieldset className="border-t border-outline-variant pt-6">
        <legend className="font-headline-md text-headline-md text-on-surface">
          User Settings
        </legend>
        <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
          Choose which name is used when the app greets and addresses you.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-outline-variant bg-surface p-4 transition-colors hover:bg-surface-container-high">
            <input
              name="displayNamePreference"
              type="radio"
              value="full_name"
              defaultChecked={patient.displayNamePreference === "full_name"}
              className="mt-1 size-4 accent-primary"
            />
            <span className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface">
                Use real name
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                Display your full name to admin.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-outline-variant bg-surface p-4 transition-colors hover:bg-surface-container-high">
            <input
              name="displayNamePreference"
              type="radio"
              value="nickname"
              defaultChecked={patient.displayNamePreference === "nickname"}
              className="mt-1 size-4 accent-primary"
            />
            <span className="flex flex-col gap-1">
              <span className="font-label-md text-label-md text-on-surface">
                Use nickname
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                Display your nickname to admin.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {state.message && (
        <p
          role="status"
          className={[
            "rounded-lg px-4 py-3 text-body-md",
            state.success
              ? "bg-primary-fixed text-on-primary-fixed"
              : "bg-error-container text-on-error-container",
          ].join(" ")}
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-md bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm outline-none transition-colors hover:bg-primary-container focus:ring-3 focus:ring-primary-fixed/60 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
