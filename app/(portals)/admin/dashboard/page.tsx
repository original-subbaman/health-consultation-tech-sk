import ConsultationList from "@/components/admin-dashboard/ConsultationList";
import SearchSection from "@/components/admin-dashboard/SearchSection";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const single = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      params.append(key, item);
    }
  }
  return (
    <section className="flex w-full flex-col gap-3">
      <header className="flex flex-col items-start justify-between gap-4 pt-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface md:font-headline-xl md:text-headline-xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
            Manage consultation requests, doctor accounts, and case assignments.
          </p>
        </div>
      </header>
      <SearchSection />
      <ConsultationList
        filters={{
          page: Number(single(query.consultationPage) ?? 1),
          doctorName: single(query.doctor),
          chiefComplaint: single(query.chiefComplaint),
          submittedDate: single(query.submittedDate),
        }}
        queryString={params.toString()}
      />
    </section>
  );
}
