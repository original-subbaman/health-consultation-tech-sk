import {
  Activity,
  Bone,
  Brain,
  CalendarCheck,
  Eye,
  HeartPulse,
  Stethoscope,
} from "lucide-react";

const specialtyIcons = {
  Cardiology: HeartPulse,
  Neurology: Brain,
  Dermatology: Activity,
  "General Medicine": Stethoscope,
  Pulmonology: Activity,
  Orthopedics: Bone,
};

const requests = [
  {
    id: "PID-884920",
    name: "Alex Rivers",
    initials: "AR",
    demographics: "44y M",
    filters: "urgent pending",
    specialty: "Cardiology",
    complaint: "Chest Discomfort & Palpitations",
    symptoms: "Substernal pressure ongoing 45 mins. Vitals pending review.",
    severity: 4,
    priority: "High / Urgent - Level 4",
    requestedAgo: "10 mins ago",
    requestedAt: "Today, 09:42 AM",
    status: "Pending Review",
    statusTone: "urgent",
    action: "Assign Consultant",
    avatarClassName: "bg-error-container text-on-error-container",
  },
  {
    id: "PID-743102",
    name: "Eleanor Pena",
    initials: "EP",
    demographics: "62y F",
    filters: "urgent specialist",
    specialty: "Neurology",
    complaint: "Migraine with Acute Visual Aura",
    symptoms: "Sudden onset hemianopsia, photo-phobia. Prior stroke history.",
    severity: 3,
    priority: "High - Level 3",
    requestedAgo: "35 mins ago",
    requestedAt: "Today, 09:17 AM",
    status: "Assigned to Dr. Vance",
    statusTone: "assigned",
    action: "Reassign",
    secondaryAction: true,
    avatarClassName: "bg-secondary-fixed text-on-secondary-fixed",
  },
  {
    id: "PID-992014",
    name: "Marcus Brody",
    initials: "MB",
    demographics: "29y M",
    filters: "pending",
    specialty: "Dermatology",
    complaint: "Persistent Rash & Allergic Reaction",
    symptoms:
      "Pruritic erythematous plaques across torso following amoxicillin.",
    severity: 2,
    priority: "Medium - Level 2",
    requestedAgo: "1 hour ago",
    requestedAt: "Today, 08:52 AM",
    status: "Pending Review",
    statusTone: "pending",
    action: "Assign Consultant",
    avatarClassName: "bg-surface-container text-on-surface",
  },
  {
    id: "PID-665123",
    name: "Sophia Lin",
    initials: "SL",
    demographics: "37y F",
    filters: "scheduled",
    specialty: "General Medicine",
    complaint: "Annual Chronic Hypertension Review",
    symptoms:
      "Routine bi-monthly monitoring; lab panel lipid bloodwork attached.",
    severity: 1,
    priority: "Standard - Level 1",
    requestedAgo: "2 hours ago",
    requestedAt: "Today, 07:45 AM",
    status: "Scheduled (14:30)",
    statusTone: "scheduled",
    action: "Edit Slot",
    secondaryAction: true,
    avatarClassName: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    id: "PID-502891",
    name: "James Wilson",
    initials: "JW",
    demographics: "58y M",
    filters: "specialist",
    specialty: "Pulmonology",
    complaint: "Exertional Dyspnea & Dry Cough",
    symptoms: "SpO2 fluctuating 91-94% room air. Prior spirometry requested.",
    severity: 3,
    priority: "High - Level 3",
    requestedAgo: "3 hours ago",
    requestedAt: "Today, 06:40 AM",
    status: "Awaiting Vitals",
    statusTone: "specialist",
    action: "Assign Specialist",
    avatarClassName: "bg-surface-container-high text-on-surface",
  },
  {
    id: "PID-419082",
    name: "Chloe Zhao",
    initials: "CZ",
    demographics: "26y F",
    filters: "pending",
    specialty: "Orthopedics",
    complaint: "Right Ankle Inversion Injury",
    symptoms: "Significant lateral malleolus edema; weight-bearing intolerant.",
    severity: 2,
    priority: "Medium - Level 2",
    requestedAgo: "4 hours ago",
    requestedAt: "Today, 05:20 AM",
    status: "Pending Review",
    statusTone: "pending",
    action: "Assign Consultant",
    avatarClassName: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
];

const specialtyColor = {
  Cardiology: "text-error",
  Neurology: "text-secondary",
  Dermatology: "text-tertiary",
  "General Medicine": "text-primary",
  Pulmonology: "text-secondary",
  Orthopedics: "text-tertiary",
};

function PriorityBadge({ request }) {
  const isHigh = request.severity >= 3;
  const isUrgent = request.severity === 4;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-label-sm text-label-sm ${
        isHigh
          ? "bg-error-container/60 font-semibold text-error"
          : request.severity === 2
            ? "bg-surface-container-high font-semibold text-on-surface-variant"
            : "bg-surface-container text-on-surface-variant"
      }`}
    >
      {request.severity > 1 ? (
        <span
          className={`size-1.5 rounded-full ${isHigh ? "bg-error" : "bg-outline"} ${isUrgent ? "animate-ping" : ""}`}
          aria-hidden="true"
        />
      ) : null}
      {request.priority}
    </span>
  );
}

function StatusBadge({ request }) {
  const statusStyles = {
    urgent: "bg-surface-container-high text-on-surface-variant",
    assigned: "bg-secondary-fixed text-on-secondary-fixed-variant",
    pending: "bg-surface-container-high text-on-surface-variant",
    scheduled: "bg-primary-fixed/50 text-on-primary-fixed-variant",
    specialist: "bg-surface-container-high text-on-surface-variant",
  };
  const dotStyles = {
    urgent: "bg-error",
    assigned: "bg-secondary",
    pending: "bg-outline",
    specialist: "bg-secondary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 font-label-sm text-label-sm font-medium ${statusStyles[request.statusTone]}`}
    >
      {request.statusTone === "scheduled" ? (
        <CalendarCheck className="size-3.5" aria-hidden="true" />
      ) : (
        <span
          className={`size-2 rounded-full ${dotStyles[request.statusTone]}`}
          aria-hidden="true"
        />
      )}
      {request.status}
    </span>
  );
}

function ConsultationRow({ request }) {
  const SpecialtyIcon = specialtyIcons[request.specialty];

  return (
    <tr
      className="transition-colors hover:bg-surface-container-low/60"
      data-filter-type={request.filters}
      data-name={request.name}
      data-severity={request.severity}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md font-semibold leading-tight text-on-surface">
              {request.name}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {request.id} &bull; {request.demographics}
            </span>
          </div>
        </div>
      </td>
      <td className="max-w-xs px-4 py-4">
        <div className="flex flex-col">
          <span className="truncate font-label-md text-label-md font-medium text-on-surface">
            {request.complaint}
          </span>
          <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
            {request.symptoms}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <div className="flex flex-col">
          <span className="font-label-md text-label-md font-medium text-on-surface">
            {request.requestedAgo}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {request.requestedAt}
          </span>
        </div>
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 font-label-sm text-label-sm font-medium transition-colors ${
              request.secondaryAction
                ? "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                : "bg-primary text-on-primary shadow-sm hover:bg-primary-container"
            }`}
          >
            {request.action}
          </button>
          <button
            type="button"
            className="rounded-lg bg-surface-container-high p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            aria-label={`View ${request.name}'s patient file`}
            title="View patient file"
          >
            <Eye className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ConsultationPagination() {
  return (
    <div className="flex flex-col items-center justify-between gap-3 bg-surface-container-low p-4 font-label-sm text-label-sm text-on-surface-variant sm:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <span>Showing 1 to 6 of 24 total queue consultations</span>
        <span className="text-outline-variant" aria-hidden="true">
          &bull;
        </span>
        <span className="font-medium text-primary">
          Batch Auto-Assignment: Active
        </span>
      </div>
      <nav className="flex items-center gap-1" aria-label="Consultation pages">
        <button
          type="button"
          disabled
          className="rounded-lg bg-surface-container px-3 py-1 text-on-surface hover:bg-surface-container-high disabled:opacity-50"
        >
          Previous
        </button>
        {[1, 2, 3, 4].map((page) => (
          <button
            key={page}
            type="button"
            aria-current={page === 1 ? "page" : undefined}
            className={`rounded-lg px-3 py-1 ${
              page === 1
                ? "bg-primary font-medium text-on-primary"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="rounded-lg bg-surface-container px-3 py-1 text-on-surface hover:bg-surface-container-high"
        >
          Next
        </button>
      </nav>
    </div>
  );
}

export default function ConsultationList() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              <th scope="col" className="px-5 py-3">
                Patient Details
              </th>
              <th scope="col" className="px-4 py-3">
                Chief Complaint &amp; Symptoms
              </th>
              <th scope="col" className="px-4 py-3">
                Requested
              </th>
              <th scope="col" className="px-5 py-3 text-right">
                Clinical Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {requests.map((request) => (
              <ConsultationRow key={request.id} request={request} />
            ))}
          </tbody>
        </table>
      </div>
      <ConsultationPagination />
    </div>
  );
}
