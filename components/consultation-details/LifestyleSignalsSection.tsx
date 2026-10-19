import type { ConsultationDetails } from "@/lib/data/consultation";
import ConsultationSection from "./ConsultationSection";
import DetailField from "./DetailField";
import { Activity } from "lucide-react";
import { formatUnderscoreText } from "@/lib/helper";

export default function LifestyleSignalsSection({
  lifestyle,
}: {
  lifestyle: ConsultationDetails["lifestyle_assessments"];
}) {
  const lifestyleSignals = [
    {
      label: "Recent weight change (>5 kg / 10 lbs)",
      value:
        lifestyle?.recent_significant_weight_change == null
          ? null
          : lifestyle.recent_significant_weight_change
            ? "Yes"
            : "No",
    },
    {
      label: "Smoking",
      value: formatUnderscoreText(lifestyle?.smoking_status),
    },
    {
      label: "Alcohol",
      value: formatUnderscoreText(lifestyle?.alcohol_use),
    },
  ];

  return (
    <ConsultationSection
      title="Lifestyle Signals"
      subtitle="Daily habits and recent changes"
      icon={Activity}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {lifestyleSignals.map(({ label, value }) => (
          <DetailField key={label} label={label} value={value} />
        ))}
        <DetailField
          label="Additional health information"
          value={lifestyle?.additional_health_information}
          fullWidth
        />
      </dl>
    </ConsultationSection>
  );
}
