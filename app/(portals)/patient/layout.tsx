import { PortalShell } from "@/components/portal/portal-shell";
import { patientNavigation } from "@/lib/navigation/patient";

export default async function PatientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell
      navigation={patientNavigation}
      user={{ name: "Patient", role: "patient" }}
    >
      {children}
    </PortalShell>
  );
}
