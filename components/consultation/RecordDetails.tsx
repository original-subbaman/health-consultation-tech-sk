import Fields from "./Fields";

const metadataFields = new Set([
  "id",
  "consultation_id",
  "patient_id",
  "doctor_id",
  "user_id",
  "created_at",
  "updated_at",
  "uploaded_by",
  "storage_path",
]);

export default function RecordDetails({ record }: { record: Record<string, unknown> | null }) {
  if (!record)
    return (
      <p className="text-sm text-on-surface-variant">
        No information recorded.
      </p>
    );
  const entries = Object.entries(record);
  const fields = Object.fromEntries(
    entries.filter(([key]) => !metadataFields.has(key)),
  );
  return <Fields record={fields} />;
}
