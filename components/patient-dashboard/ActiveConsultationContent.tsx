"use client";
import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "react-aria-components";

type ActiveConsultationContentProps = {
  doctorName: string;
  submittedOn: string;
};

function ActiveConsultationContent({
  doctorName,
  submittedOn,
}: ActiveConsultationContentProps) {
  function onViewMore() {}
  return (
    <>
      <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-xl">
        <Rocket aria-hidden="true" className="size-4 text-primary" />
        Active Consultation
      </span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface">
        {doctorName}
      </h2>
      <span>Submitted On: {submittedOn}</span>
      <Button
        onClick={onViewMore}
        className="group mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md 
      bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-sm 
      outline-none transition-all data-hovered:bg-primary-container data-pressed:scale-[0.98] data-focus-visible:ring-3 data-[focus-visible]:ring-primary-fixed/60 disabled:cursor-not-allowed disabled:opacity-60"
      >
        View More
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform group-data-hovered:translate-x-0.5"
        />
      </Button>
    </>
  );
}

export default ActiveConsultationContent;
