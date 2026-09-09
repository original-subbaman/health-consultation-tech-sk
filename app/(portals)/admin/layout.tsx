import { PortalShell } from "@/components/portal/portal-shell";
import { requireAdmin } from "@/lib/auth/auth";
import { adminNavigation } from "@/lib/navigation/admin";

export default async function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <PortalShell navigation={adminNavigation} user={user}>
      {children}
    </PortalShell>
  );
}
