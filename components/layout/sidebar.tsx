import { SquareActivity } from "lucide-react";
import type { NavigationItem } from "../portal/portal-shell";
import NavItem from "../navigation/nav-item";
import LogoutForm from "./logout-form";

type SidebarProps = {
  user: { name: string; role: string };
  navigation: NavigationItem[];
};

export default function Sidebar({ user, navigation }: SidebarProps) {
  const userInitial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <nav className="sticky top-0 hidden h-dvh w-full flex-col gap-2 bg-surface-container-low p-4 shadow-md dark:bg-surface-dim dark:shadow-none md:flex">
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <SquareActivity className="text-primary text-3xl" />
        <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
          HealthSync
        </span>
      </div>
      <div className="flex items-center gap-4 px-4 py-4 mb-6 bg-surface-container-highest rounded-xl">
        <div
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-surface bg-primary text-label-md font-bold text-on-primary"
        >
          {userInitial}
        </div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-primary font-bold">
            {user.name}
          </span>
          <span className="text-xs capitalize text-on-surface-variant">
            {user.role}
          </span>
        </div>
      </div>
      <div className="h-full flex-1 flex-col gap-2">
        {navigation.map(({ href, label, icon: Icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={<Icon aria-hidden="true" className="size-5" />}
          />
        ))}
      </div>
      <div className="border-t-2 border-gray-500 px-4 py-3">
        <LogoutForm />
      </div>
    </nav>
  );
}
