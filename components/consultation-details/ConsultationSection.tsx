import { ClipboardCheck, type LucideIcon } from "lucide-react";

export default function ConsultationSection({
  children,
  title,
  subtitle,
  icon: Icon = ClipboardCheck,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">
              {title}
            </h2>
            <p className="font-label-sm text-label-sm text-tertiary">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
