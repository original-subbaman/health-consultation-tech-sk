import { createConsultantAction } from "@/actions/consultant";
import AddConsultantForm from "@/components/add-consultant/add-consultant-form";
import { UserPlus } from "lucide-react";

function Header() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1.5">
        <UserPlus className="material-symbols-outlined text-primary-container text-2xl" />
        <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
          Add Consultant
        </h1>
      </div>
      <p className="text-sm text-[#3d4947] leading-relaxed">
        Register a new certified medical practitioner.
      </p>
    </div>
  );
}

export default async function AddConsultantsPage() {
  return (
    <main className="flex-1 w-full max-w-md mx-auto px-4 py-6">
      <Header />
      <div className="bg-white rounded-2xl p-5 border border-[#bcc9c6]/30 shadow-sm">
        <AddConsultantForm action={createConsultantAction} />
      </div>
    </main>
  );
}
