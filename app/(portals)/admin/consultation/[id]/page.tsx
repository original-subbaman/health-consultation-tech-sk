import Card from "@/components/consultation/Card";
import RecordDetails from "@/components/consultation/RecordDetails";
import Records from "@/components/consultation/Records";
import Value from "@/components/consultation/Value";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, FileText, Sparkles } from "lucide-react";
import { getConsultationDetails } from "@/lib/data/consultation";
import { buttonStyles } from "@/components/ui/button";

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
          <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium capitalize text-primary">
            {c.status.replace(/_/g, " ")}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 rounded-xl bg-surface-container-low p-4 text-sm">
          <p>
            <span className="text-on-surface-variant">Assigned doctor: </span>
            <span className="font-medium">
              {c.doctor?.full_name ?? "Not assigned"}
            </span>
          </p>
          <p>
            <span className="text-on-surface-variant">Submitted: </span>
            <Value value={c.submitted_at} field="submitted_at" />
          </p>
        </div>
        <nav
          aria-label="Consultation sections"
          className="flex flex-wrap gap-2"
        >
          {[
            ["overview", "Overview"],
            ["assessment", "AI assessment"],
            ["intake", "Intake & vitals"],
            ["history", "Medical history"],
            ["documents", "Documents"],
          ].map(([anchor, title]) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="inline-flex min-h-11 items-center rounded-lg border border-outline-variant px-4 text-sm font-medium text-on-surface outline-none hover:bg-surface-container-high focus-visible:ring-2 focus-visible:ring-primary"
            >
              {title}
            </a>
          ))}
        </nav>
      </header>

      <section id="assessment" className="scroll-mt-24 space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="size-5 text-primary" aria-hidden="true" /> AI
          assessment
        </h2>
        <div className="rounded-2xl border border-primary/20 bg-surface-container-lowest p-5 sm:p-6">
          <p className="mb-5 rounded-lg bg-primary/5 p-3 text-sm text-on-surface-variant">
            Draft for clinician review. Possible diagnoses are not confirmed
            diagnoses.
          </p>
          <RecordDetails record={c.ai_consultation_summary} />
        </div>
      </section>

      <section id="overview" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <div className="grid items-start gap-4 @[38rem]:grid-cols-2">
          <Card title="Patient">
            <RecordDetails record={c.patient ? patient : null} />
            <div className="mt-6 border-t border-outline-variant/60 pt-5">
              <h4 className="mb-4 font-medium">Patient profile</h4>
              <RecordDetails record={patientProfile ?? null} />
            </div>
          </Card>
          <Card title="Doctor">
            <RecordDetails record={c.doctor ? doctor : null} />
            <div className="mt-6 border-t border-outline-variant/60 pt-5">
              <h4 className="mb-4 font-medium">Doctor profile</h4>
              <RecordDetails record={doctorProfile ?? null} />
            </div>
          </Card>
          <div className="@[38rem]:col-span-2">
            <Card title="Consultation">
              <RecordDetails record={consultation} />
            </Card>
          </div>
        </div>
      </section>

      <section id="intake" className="scroll-mt-24 space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ClipboardList className="size-5 text-primary" aria-hidden="true" />{" "}
          Intake & vitals
        </h2>
        <div className="grid items-start gap-4 @[38rem]:grid-cols-2">
          <Card title="Consultation intake">
            <RecordDetails record={c.consultation_intakes} />
          </Card>
          <Card title="Measurements">
            <Records records={c.patient_measurements} name="Measurement" />
          </Card>
        </div>
      </section>

      <section id="history" className="scroll-mt-24 space-y-4">
        <h2 className="text-xl font-semibold">Medical history & lifestyle</h2>
        <div className="grid items-start gap-4 @[38rem]:grid-cols-2">
          <Card title="Medical history">
            <RecordDetails record={c.patient_medical_history} />
          </Card>
          <Card title="Lifestyle">
            <RecordDetails record={c.lifestyle_assessments} />
          </Card>
          <Card title="Medications">
            <Records records={c.patient_medications} name="Medication" />
          </Card>
          <Card title="Allergies">
            <Records records={c.patient_allergies} name="Allergy" />
          </Card>
        </div>
      </section>

      <section id="documents" className="scroll-mt-24 space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <FileText className="size-5 text-primary" aria-hidden="true" />{" "}
          Documents{" "}
          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-sm">
            {c.documents.length}
          </span>
        </h2>
        <Card title="Uploaded documents">
          <Records records={c.documents} name="Document" />
        </Card>
      </section>
    </div>
  );
}
