"use client";

import { analyzeConsultation } from "@/actions/consultations";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeConsultationButton({
  consultationId,
  patientName,
  secondaryAction,
  isAnalyzed,
}: {
  consultationId: string;
  patientName: string;
  secondaryAction: boolean;
  isAnalyzed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  function analyze() {
    startTransition(async () => {
      try {
        const result = await analyzeConsultation({ consultationId });
        if (!result.success) {
          toast({
            title: "Analysis failed",
            description: result.message,
            variant: "error",
          });
          return;
        }
        router.refresh();
        toast({
          title: "Analysis complete",
          description: result.message,
          variant: "success",
        });
        dialog.current?.showModal();
      } catch {
        toast({
          title: "Analysis failed",
          description: "Analysis could not be completed. Please try again.",
          variant: "error",
        });
      }
    });
  }

  return (
    <div className="max-w-sm whitespace-normal text-left">
      <Button
        variant={secondaryAction ? "secondary" : "primary"}
        disabled={isPending}
        aria-busy={isPending}
        aria-label={`${isAnalyzed ? "View AI assessment" : "Analyze consultation"} for ${patientName}`}
        onClick={isAnalyzed ? () => dialog.current?.showModal() : analyze}
      >
        {isPending ? "Analyzing…" : isAnalyzed ? "View Analysis" : "Analyse"}
      </Button>
      <span role="status" className="sr-only">
        {isPending ? "Analyzing consultation. Please wait." : ""}
      </span>
    </div>
  );
}
