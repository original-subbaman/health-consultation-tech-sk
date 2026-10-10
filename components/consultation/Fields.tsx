import Value from "./Value";

const labels: Record<string, string> = {
  systolic_bp: "Systolic blood pressure (mmHg)",
  diastolic_bp: "Diastolic blood pressure (mmHg)",
  weight_kg: "Weight (kg)",
  height_cm: "Height (cm)",
  discomfort_severity: "Discomfort severity (0–10)",
  possible_diagnosis: "Possible diagnoses",
  concerns: "Concerns for clinician review",
  is_pregnant: "Pregnancy reported",
  file_size: "File size (bytes)",
  mime_type: "File format",
};

function label(key: string) {
  return (
    labels[key] ??
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^./, (first) => first.toUpperCase())
  );
}

export default function Fields({ record }: { record: Record<string, unknown> }) {
  return (
    <dl className="grid gap-4">
      {Object.entries(record).map(([key, value]) => (
        <div key={key} className="min-w-0">
          <dt className="mb-1 text-sm font-medium text-on-surface-variant">
            {label(key)}
          </dt>
          <dd className="wrap-break-words whitespace-pre-wrap text-base leading-6 text-on-surface [overflow-wrap:anywhere]">
            <Value value={value} field={key} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
