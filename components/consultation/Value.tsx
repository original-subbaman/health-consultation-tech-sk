import Fields from "./Fields";

export default function Value({ value, field = "" }: { value: unknown; field?: string }) {
  if (value == null || value === "") {
    return <span className="text-on-surface-variant">Not recorded</span>;
  }
  if (typeof value === "boolean") return <>{value ? "Yes" : "No"}</>;
  if (Array.isArray(value)) {
    if (!value.length)
      return (
        <span className="text-on-surface-variant">No entries recorded</span>
      );
    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index} className="border-l-2 border-outline-variant pl-3">
            <Value value={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return <Fields record={value as Record<string, unknown>} />;
  }
  if (typeof value === "string" && /(_at|date_of_birth)$/.test(field)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return (
        <time dateTime={value}>
          {new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            ...(/T/.test(value) ? { timeStyle: "short" as const } : {}),
            timeZone: "Asia/Kolkata",
          }).format(date)}
          {/T/.test(value) && " IST"}
        </time>
      );
    }
  }
  return <>{String(value)}</>;
}
