import { CalendarDays, LayoutDashboard, UserRound } from "lucide-react";

export const patientNavigation = [
  {
    label: "Dashboard",
    href: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Consultation",
    href: "/patient/consultations",
    icon: CalendarDays,
  },
  {
    label: "Profile",
    href: "/patient/profile",
    icon: UserRound,
  },
];
