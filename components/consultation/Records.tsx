import RecordDetails from "./RecordDetails";

export default function Records({
  records,
  name,
}: {
  records: Record<string, unknown>[];
  name: string;
}) {
  if (!records.length)
    return (
      <p className="text-sm text-on-surface-variant">
        No {name.toLowerCase()} recorded.
      </p>
    );
  return (
    <div className="space-y-6">
      {records.map((record, index) => (
        <div
          key={String(record.id ?? index)}
          className="border-t border-outline-variant/60 pt-4 first:border-0 first:pt-0"
        >
          {records.length > 1 && (
            <h4 className="mb-4 font-medium">
              {name} {index + 1}
            </h4>
          )}
          <RecordDetails record={record} />
        </div>
      ))}
    </div>
  );
}
