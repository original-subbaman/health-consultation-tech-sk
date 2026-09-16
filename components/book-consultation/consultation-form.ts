export type ConsultationFormValues = {
  patient: {
    name: string;
    nickname: string;
    weight: number | null;
    height: number | null;
    sex: "" | "female" | "male" | "intersex" | "prefer_not_to_say";
    dob: string;
  };
  baseline: {
    redFlags: string[];
    chiefComplaint: string;
    primaryConcern: string;
    goals: string[];
    usualHealth: string;
    symptoms: string[];
    onset: string;
    pain: number | null;
  };
  currentIssueTrend: {
    trend: string;
    speedOfChange: string;
    longitudinalTrend: string;
    redFlagSymptoms: string[];
  };
  medicalHistory: {
    conditions: string[];
    recentSymptoms: string[];
    medications: string;
    allergyStatus: "" | "yes" | "none";
    allergyDetails: string;
    medicalRecords: File[];
    lifestyle: {
      recentWeightChange: "" | "yes" | "no";
      smoking: "" | "never" | "former" | "current";
      alcohol: "" | "none" | "occasional" | "regular";
      additionalNotes: string;
    };
  };
};

export const consultationFormDefaultValues: ConsultationFormValues = {
  patient: {
    name: "",
    nickname: "",
    weight: null,
    height: null,
    sex: "",
    dob: "",
  },
  baseline: {
    redFlags: ["none"],
    chiefComplaint:
      "Persistent throbbing headache in right frontal region for 3 days, worsening in afternoon. Accompanied by mild neck tightness and sensitivity to bright office light. No vision blur or aura noted.",
    primaryConcern:
      "It hasn't subsided with OTC acetaminophen and is disrupting my workday focus.",
    goals: ["Diagnosis", "Treatment / Prescription"],
    usualHealth: "Slightly worse",
    symptoms: ["Pain", "Fatigue / Energy", "Sleep Problem"],
    onset: "1–3 days ago",
    pain: 5,
  },
  currentIssueTrend: {
    trend: "",
    speedOfChange: "",
    longitudinalTrend: "",
    redFlagSymptoms: ["none"],
  },
  medicalHistory: {
    conditions: ["none"],
    recentSymptoms: ["none"],
    medications: "",
    allergyStatus: "",
    allergyDetails: "",
    medicalRecords: [],
    lifestyle: {
      recentWeightChange: "",
      smoking: "",
      alcohol: "",
      additionalNotes: "",
    },
  },
};
