import type { ReactNode } from "react";

export type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  status?: string | null;
};

export default function StatCard({
  icon,
  label,
  value,
  unit,
  status,
}: StatCardProps) {
  return (
    <div
      className="bg-surface-container-lowest rounded-lg shadow-ambient p-5 
      border border-outline-variant 
      flex flex-col items-start gap-1 justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-secondary">{icon}</span>
          <h3 className="font-label-md text-label-md text-on-surface-variant">
            {label}
          </h3>
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-headline-lg text-headline-lg text-on-surface-variant">
            {value}
          </span>
          {unit && (
            <span className="font-body-md text-body-md text-tertiary">
              {unit}
            </span>
          )}
        </div>
        {status && (
          <span className="font-label-sm text-label-sm text-primary bg-primary-fixed-dim px-2 py-1 rounded-xl">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
