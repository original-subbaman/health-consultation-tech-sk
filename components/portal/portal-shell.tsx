import type { LucideIcon } from "lucide-react";
import Sidebar from "../layout/sidebar";
import Topbar from "../layout/topbar";
import MobileBottomBar from "../layout/mobile-bottom-bar";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type PortalShellProps = {
  children: React.ReactNode;
  navigation: NavigationItem[];
  user: {
    name: string;
    role: string;
  };
};

export function PortalShell({ children, navigation, user }: PortalShellProps) {
  return (
    <div className="grid min-h-dvh bg-surface md:grid-cols-[18rem_minmax(0,1fr)]">
      <Sidebar user={user} navigation={navigation} />
      <div className="min-w-0 md:min-h-dvh">
        <Topbar user={user} />
        <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <MobileBottomBar navigation={navigation} />
      </div>
    </div>
  );
}
