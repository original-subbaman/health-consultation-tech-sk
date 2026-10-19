import { assignDoctorForConsultation } from "@/actions/consultations";
import PatientDetails from "@/components/consultation-details/PatientDetails";
import PatientInformationSection from "@/components/consultation-details/PatientInformationSection";
import MedicalHistorySection from "@/components/consultation-details/MedicalHistorySection";
import LifestyleSignalsSection from "@/components/consultation-details/LifestyleSignalsSection";
import BaselineSnapshotSection from "@/components/consultation-details/BaselineSnapshotSection";
import SymptomsAndTrendsSection from "@/components/consultation-details/SymptomsAndTrendsSection";
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
        <div className="flex flex-col items-start gap-4">
          <p className="mb-2 text-sm font-medium text-primary">
            Consultation details
          </p>
          <PatientDetails
            patientName={c.patient?.full_name}
            dob={c.patient?.patient_profiles?.date_of_birth}
            assignedDoctor={c.doctor?.full_name}
            status={c.status}
            doctors={doctors}
            error={doctorsError}
            assignDoctor={assignDoctorForConsultation}
            consultationId={consultation.id}
          />
        </div>
      </header>
      <div className="grid grid-cols-2 gap-6">
        {/* col 1 */}
        <div className="col-span-2 space-y-6 lg:col-span-1">
          {/* Patient Information */}
          <PatientInformationSection measurement={c.patient_measurements[0]} />
          <MedicalHistorySection
            history={c.patient_medical_history}
            medications={c.patient_medications}
            allergies={c.patient_allergies}
            documents={c.documents}
          />
          <LifestyleSignalsSection lifestyle={c.lifestyle_assessments} />
        </div>
        {/* col 2 */}
        <div className="col-span-2 space-y-6 lg:col-span-1">
          <BaselineSnapshotSection intake={c.consultation_intakes} />
          <SymptomsAndTrendsSection intake={c.consultation_intakes} />
        </div>
      </div>
    </div>
  );
}
