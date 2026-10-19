import type { ReactNode } from "react";

type DetailFieldProps = {
  label: string;
  value: ReactNode;
  unit?: string;
  fullWidth?: boolean;
  variant?: "card" | "plain";
  emphasis?: boolean;
};

/** Render inside a description list (<dl>); the parent controls its grid layout. */
export default function DetailField({
  label,
  value,
  unit,
  fullWidth = false,
  variant = "card",
  emphasis = false,
}: DetailFieldProps) {
  const isEmpty = value == null || value === "" || typeof value === "boolean";

  return (
    <div
      className={`min-w-0 ${variant === "card" ? "rounded-lg bg-surface-container-low p-4" : ""} ${fullWidth ? "sm:col-span-2" : ""}`}
    >
      <dt className="text-sm text-on-surface-variant">{label}</dt>
      <dd
        className={`${variant === "card" ? "mt-2" : "mt-1"} whitespace-pre-wrap wrap-break-words ${emphasis ? "text-lg font-semibold" : "text-sm font-medium"} text-on-surface`}
      >
        {isEmpty ? (
          <span className="text-sm font-normal text-on-surface-variant">
            Not recorded
          </span>
        ) : (
          <>
            {value}
            {unit && (
              <span className="ml-1 text-sm font-normal text-on-surface-variant">
                {unit}
              </span>
            )}
          </>
        )}
      </dd>
    </div>
  );
}
