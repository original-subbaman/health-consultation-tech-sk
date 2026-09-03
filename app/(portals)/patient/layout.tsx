import { PortalShell } from "@/components/portal/portal-shell";
import { requirePatient } from "@/lib/auth/auth";
import { patientNavigation } from "@/lib/navigation/patient";

export default async function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePatient();

  return (
    <PortalShell navigation={patientNavigation} user={user}>
      {children}
    </PortalShell>
  );
}
