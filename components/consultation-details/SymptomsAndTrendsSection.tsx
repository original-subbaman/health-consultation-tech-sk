import type { ConsultationDetails } from "@/lib/data/consultation";
import ConsultationSection from "./ConsultationSection";
import DetailField from "./DetailField";
import { TrendingUp } from "lucide-react";
import { formatUnderscoreText } from "@/lib/helper";

export default function SymptomsAndTrendsSection({
  intake,
}: {
  intake: ConsultationDetails["consultation_intakes"];
}) {
  const redFlagLabels: Record<string, string> = {
    weight_loss: "Unexplained weight loss",
    persistent_fever: "Persistent fever",
    night_sweats: "Night sweats",
    blood: "Blood in stool or urine",
    severe_itching: "Severe itching",
    fainting: "Fainting episodes",
    none: "None",
  };
  const symptomsAndTrends = [
    {
      label: "Current issue trend",
      value: intake?.current_issue_trend,
    },
    {
      label: "Speed of change",
      value: intake?.speed_of_change,
    },
    {
      label: "Longitudinal trend",
      value: intake?.longitudinal_trend,
    },
    {
      label: "Red flag symptoms (past month)",
      value: intake?.red_flag_symptoms
        ?.map((symptom) => redFlagLabels[symptom] ?? formatUnderscoreText(symptom))
        .join(", "),
    },
  ];

  return (
    <ConsultationSection
      title="Symptoms & Trends"
      subtitle="Current episode progression and changes over recent weeks"
      icon={TrendingUp}
    >
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {symptomsAndTrends.map(({ label, value }) => (
          <DetailField key={label} label={label} value={value} />
        ))}
      </dl>
    </ConsultationSection>
  );
}
