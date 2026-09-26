type MedicationFormValue = {
  id?: string;
  medicationName: string;
  strength: string;
  quantity: string;
  frequency: string;
};

type AllergyFormValue = {
  id?: string;
  allergyName: string;
  details: string;
};

export type ConsultationFormValues = {
  patient: {
    systolicBp: number | null;
    diastolicBp: number | null;
    weightKg: number | null;
    measuredAt: string | null;
  };
  baseline: {
    redFlags: string[];
    redFlagsOther: string;
    chiefComplaint: string;
    primaryConcern: string;
    goals: string[];
    goalsOther: string;
    usualHealth: string;
    symptoms: string[];
    symptomsOther: string;
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
    medications: MedicationFormValue[];
    allergies: AllergyFormValue[];
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
    systolicBp: null,
    diastolicBp: null,
    weightKg: null,
    measuredAt: null,
  },
  baseline: {
    redFlags: ["none"],
    redFlagsOther: "",
    chiefComplaint: "",
    primaryConcern: "",
    goals: [],
    goalsOther: "",
    usualHealth: "",
    symptoms: [],
    symptomsOther: "",
    onset: "",
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
    medications: [],
    allergies: [],
    medicalRecords: [],
    lifestyle: {
      recentWeightChange: "",
      smoking: "",
      alcohol: "",
      additionalNotes: "",
    },
  },
};
