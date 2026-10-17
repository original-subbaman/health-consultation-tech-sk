import { assignDoctorForConsultation } from "@/actions/consultations";
import AssignDoctorDialog from "@/components/consultation/AssignDoctorDialog";
import { buttonStyles } from "@/components/ui/button";
import { getDoctorOptions } from "@/lib/data/consultant";
import { getConsultationDetails } from "@/lib/data/consultation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConsultationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getConsultationDetails(id);

  if (!result.success) {
    if (
      result.message === "Consultation not found" ||
      result.message === "Invalid consultation ID"
    )
      notFound();
    return (
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
        <h1 className="text-xl font-semibold">
          Consultation could not be loaded
        </h1>
        <p role="alert" className="mt-3 text-on-surface-variant">
          {result.message}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/admin/consultation/${id}`}
            className={buttonStyles({ className: "min-h-11" })}
          >
            Try again
          </Link>
          <Link
            href="/admin/dashboard"
            className={buttonStyles({
              variant: "secondary",
              className: "min-h-11",
            })}
          >
            Back to consultations
          </Link>
        </div>
      </section>
    );
  }

  const c = result.consultation;
  const { patient_profiles: patientProfile, ...patient } = c.patient ?? {};
  const { doctor_profiles: doctorProfile, ...doctor } = c.doctor ?? {};
  const consultation = {
    status: c.status,
    submitted_at: c.submitted_at,
    completed_at: c.completed_at,
    id: c.id,
    patient_id: c.patient_id,
    doctor_id: c.doctor_id,
    created_at: c.created_at,
    updated_at: c.updated_at,
  };

  let doctors: Awaited<ReturnType<typeof getDoctorOptions>> = [];
  let doctorsError: string | undefined;
  try {
    doctors = await getDoctorOptions();
  } catch {
    doctorsError =
      "Doctors could not be loaded. Please refresh the page to try again.";
  }

  return (
    <div className="@container mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-5">
        <Link
          href="/admin/dashboard#consultations"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to
          consultations
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-medium text-primary">
              Consultation details
            </p>
            <h1 className="wrap-break-words font-headline-lg text-headline-lg text-on-surface">
              {c.patient?.full_name ?? "Patient name not recorded"}
            </h1>
            <p className="mt-3 max-w-2xl wrap-break-words text-lg text-on-surface-variant">
              {c.consultation_intakes?.chief_complaint ||
                "Chief complaint not recorded"}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-y-3 rounded-xl bg-surface-container-low p-3 text-sm">
          <div className="flex flex-wrap gap-x-8">
            <p>
              <span className="text-on-surface-variant">Assigned doctor: </span>
              <span className="font-medium">
                {c.doctor?.full_name ?? "Not assigned"}
              </span>
            </p>
            <p>
              <span className="text-on-surface-variant">Submitted: </span>
            </p>
          </div>
          <AssignDoctorDialog
            doctors={doctors}
            error={doctorsError}
            assignDoctor={assignDoctorForConsultation}
            consultationId={consultation.id}
          />
        </div>
      </header>
    </div>
  );
}
