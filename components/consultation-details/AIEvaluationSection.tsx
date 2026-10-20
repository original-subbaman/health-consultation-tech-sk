import type { Tables } from "@/database.types";
import AnalyzeConsultationButton from "@/components/admin-dashboard/AnalyzeConsultationButton";
import { ChevronDown, Sparkles } from "lucide-react";
import { z } from "zod";
import DetailField from "./DetailField";

const diagnosesSchema = z.array(
  z.object({
    condition: z.string(),
    supportingEvidence: z.array(z.string()),
    uncertainties: z.array(z.string()),
  }),
);

function EvaluationList({
  title,
  items,
}: {
  title: string;
  items: string[] | null;
}) {
  return (
    <div className="min-w-0 space-y-3 rounded-lg bg-surface-container-low p-4">
      <h3 className="font-semibold text-on-surface">{title}</h3>
      {items?.length ? (
        <ul className="list-disc space-y-2 pl-5 text-sm text-on-surface">
          {items.map((item, index) => (
            <li key={index} className="whitespace-pre-wrap wrap-break-words">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-on-surface-variant">
          {items ? "None listed." : "Not recorded."}
        </p>
      )}
    </div>
  );
}

export default function AIEvaluationSection({
  evaluation,
  consultationId,
  patientName,
}: {
  evaluation: Tables<"ai_clinical_evaluations"> | null;
  consultationId: string;
  patientName: string;
}) {
  const diagnoses = diagnosesSchema.safeParse(evaluation?.possible_diagnosis);
  const createdAt = evaluation ? new Date(evaluation.created_at) : null;
  const formattedDate =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        }).format(createdAt) + " IST"
      : null;

  return (
    <details
      open
      className="group rounded-xl bg-surface-container-lowest shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl p-6 outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          AI Evaluation
        </h2>
        <span className="ml-auto hidden rounded-full bg-surface-container-high px-3 py-1 text-xs font-medium text-on-surface-variant sm:inline-flex">
          {evaluation ? "Draft for clinician review" : "Not generated"}
        </span>
        <ChevronDown
          className="ml-auto size-5 shrink-0 text-on-surface-variant transition-transform group-open:rotate-180 sm:ml-0"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-5 px-6 pb-6">
        {evaluation ? (
          <>
            <p className="text-sm text-on-surface-variant">
              AI-generated draft for clinician review. Possible diagnoses are
              unconfirmed.
            </p>
            <dl>
              <DetailField label="Summary" value={evaluation.summary} />
            </dl>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <EvaluationList
                title="Key findings"
                items={evaluation.key_findings}
              />
              <EvaluationList
                title="Missing information"
                items={evaluation.missing_information}
              />
              <EvaluationList
                title="Concerns for clinician review"
                items={evaluation.concerns}
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-on-surface">
                Possible diagnoses
              </h3>
              {diagnoses.success && diagnoses.data.length > 0 ? (
                <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {diagnoses.data.map((diagnosis, index) => (
                    <li
                      key={index}
                      className="min-w-0 space-y-3 rounded-xl border border-outline-variant p-4"
                    >
                      <h4 className="wrap-break-words font-semibold text-on-surface">
                        {diagnosis.condition}
                      </h4>
                      <EvaluationList
                        title="Supporting evidence"
                        items={diagnosis.supportingEvidence}
                      />
                      <EvaluationList
                        title="Uncertainties"
                        items={diagnosis.uncertainties}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  {evaluation.possible_diagnosis == null
                    ? "Not recorded."
                    : diagnoses.success
                      ? "No possible diagnoses listed."
                      : "Saved diagnoses could not be displayed because their format is unrecognized."}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-on-surface-variant">
              No AI evaluation has been generated for this consultation yet.
            </p>
            <AnalyzeConsultationButton
              consultationId={consultationId}
              patientName={patientName}
              secondaryAction={false}
              isAnalyzed={false}
            />
          </div>
        )}
      </div>
    </details>
  );
}
