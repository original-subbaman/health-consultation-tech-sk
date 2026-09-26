import BookConsultationForm from "@/app/(portals)/patient/book-consultation/BookConsultationForm";
import {
  getLatestDraftConsultation,
  getConsultationFormValues,
} from "@/lib/data/consultation";

export default async function BookConsultationPage() {
  const result = await getLatestDraftConsultation();

  if (!result.success) {
    return (
      <section className="rounded-xl bg-surface-container-lowest p-6 shadow-sm">
        <h1 className="font-headline-md text-headline-md text-on-surface">
          Consultation unavailable
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          {result.message}
        </p>
      </section>
    );
  }

  const formValues = await getConsultationFormValues(result.consultation.id);

  return (
    <BookConsultationForm
      consultationId={result.consultation.id}
      formValues={formValues}
    />
  );
}
