"use client";

import type { assignDoctorForConsultation } from "@/actions/consultations";
import { Button, buttonStyles } from "@/components/ui/button";
import { useId, useState, type SubmitEvent } from "react";
import {
  Button as AriaButton,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import DoctorDropdown, { type DoctorOption } from "./DoctorDropdown";
import { useRouter } from "next/navigation";
import { toast } from "../ui/toast";

export default function AssignDoctorDialog({
  doctors,
  error,
  assignDoctor,
  consultationId,
}: {
  doctors: DoctorOption[];
  error?: string;
  assignDoctor: typeof assignDoctorForConsultation;
  consultationId: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [assignmentError, setAssignmentError] = useState<string>();
  const router = useRouter();

  const titleId = useId();
  const descriptionId = useId();

  async function handleOnSubmit(
    event: SubmitEvent<HTMLFormElement>,
    close: () => void,
  ) {
    event.preventDefault();
    if (isPending) return;

    const doctorId = new FormData(event.currentTarget).get("doctorId");
    if (typeof doctorId !== "string" || !doctorId) {
      setAssignmentError("Select a doctor");
      return;
    }

    setIsPending(true);
    setAssignmentError(undefined);

    try {
      const result = await assignDoctor({ consultationId, doctorId });

      if (!result.success) {
        setAssignmentError(result.message);
        return;
      }
      toast({
        title: "Doctor assigned successfully",
        variant: "success",
      });
      close();
      router.refresh();
    } catch {
      setAssignmentError("Doctor could not be assigned");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <DialogTrigger>
      <AriaButton className={buttonStyles()}>Assign Doctor</AriaButton>
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      >
        <Modal className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 text-on-surface shadow-xl">
          <Dialog
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="outline-none"
          >
            {({ close }) => (
              <form onSubmit={(event) => handleOnSubmit(event, close)}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h2 id={titleId} className="text-xl font-semibold">
                      Assign doctor
                    </h2>
                    <p
                      id={descriptionId}
                      className="text-sm text-on-surface-variant"
                    >
                      Select a doctor for this consultation.
                    </p>
                  </div>
                  {error ? (
                    <p role="alert" className="text-sm text-error">
                      {error}
                    </p>
                  ) : (
                    <>
                      <DoctorDropdown doctors={doctors} />
                      {doctors.length === 0 && (
                        <p
                          role="status"
                          className="text-sm text-on-surface-variant"
                        >
                          No doctors are available.
                        </p>
                      )}
                    </>
                  )}
                  {assignmentError && (
                    <p role="alert" className="text-sm text-error">
                      {assignmentError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        close();
                        setAssignmentError(undefined);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !!error || doctors.length === 0}
                    >
                      {isPending ? "Assigning…" : "Assign"}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
