"use client";

import { useMemo, useState } from "react";

type Consultation = {
  doctorName: string;
  specialty: string;
  date: string;
  isoDate: string;
  time: string;
};

const consultations: Consultation[] = [
  {
    doctorName: "Dr. John Doe",
    specialty: "General Physician",
    date: "13/09/2023",
    isoDate: "2023-09-13",
    time: "10:30 AM",
  },
  {
    doctorName: "Dr. Jane Smith",
    specialty: "Cardiologist",
    date: "15/09/2023",
    isoDate: "2023-09-15",
    time: "2:00 PM",
  },
];

function ConsultationCard({
  consultation: { doctorName, specialty, date, time },
}: {
  consultation: Consultation;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-ambient p-5 border border-outline-variant flex items-center justify-between">
      <div>
        <h3 className="font-label-md text-label-md text-on-surface-variant">
          {doctorName}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {specialty}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {date}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {time}
        </span>
      </div>
    </div>
  );
}

type ConsultationFiltersProps = {
  doctors: string[];
  selectedDoctor: string;
  selectedDate: string;
  onDoctorChange: (doctor: string) => void;
  onDateChange: (date: string) => void;
};

function ConsultationFilters({
  doctors,
  selectedDoctor,
  selectedDate,
  onDoctorChange,
  onDateChange,
}: ConsultationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
        Doctor
        <select
          value={selectedDoctor}
          onChange={(event) => onDoctorChange(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
        >
          <option value="">All doctors</option>
          {doctors.map((doctorName) => (
            <option key={doctorName} value={doctorName}>
              {doctorName}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface-variant">
        Date
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-fixed"
        />
      </label>
    </div>
  );
}

export default function ConsultationList() {
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");

  const doctors = useMemo(
    () => [...new Set(consultations.map(({ doctorName }) => doctorName))],
    [],
  );

  const filteredConsultations = useMemo(
    () =>
      consultations.filter(
        (consultation) =>
          (!doctor || consultation.doctorName === doctor) &&
          (!date || consultation.isoDate === date),
      ),
    [date, doctor],
  );

  return (
    <search className="w-full">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Your Consultations
        </h2>
        <ConsultationFilters
          doctors={doctors}
          selectedDoctor={doctor}
          selectedDate={date}
          onDoctorChange={setDoctor}
          onDateChange={setDate}
        />
      </div>
      <div className="flex flex-col gap-4">
        {filteredConsultations.map((consultation) => (
          <ConsultationCard
            key={`${consultation.doctorName}-${consultation.date}-${consultation.time}`}
            consultation={consultation}
          />
        ))}
        {filteredConsultations.length === 0 && (
          <p className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 text-center text-body-md text-on-surface-variant">
            No records found..
          </p>
        )}
      </div>
    </search>
  );
}
