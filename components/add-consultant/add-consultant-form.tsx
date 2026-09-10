"use client";

import type { CreateConsultantState } from "@/actions/consultant";
import {
  Badge,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { useActionState, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
  Text,
  TextField,
} from "react-aria-components";

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#3d4947]";
const inputClassName =
  "w-full rounded-xl border border-[#bcc9c6]/60 bg-[#f8f9ff] py-2.5 pl-10 pr-3.5 text-sm font-medium text-[#0b1c30] outline-none transition-all placeholder:text-[#6d7a77]/60 data-[focused]:border-transparent data-[focused]:ring-2 data-[focused]:ring-[#00685f] data-[invalid]:border-red-600";
const fieldErrorClassName = "mt-1 text-xs text-red-600";

const specialties = [
  { id: "cardiology", name: "Cardiology" },
  { id: "dermatology", name: "Dermatology" },
  { id: "general_medicine", name: "General Medicine & Primary Care" },
  { id: "neurology", name: "Neurology" },
  { id: "pediatrics", name: "Pediatrics" },
  { id: "psychiatry", name: "Psychiatry & Mental Health" },
  { id: "orthopedics", name: "Orthopedics" },
  { id: "endocrinology", name: "Endocrinology" },
];

const initialState: CreateConsultantState = {};

type AddConsultantFormProps = {
  action: (
    state: CreateConsultantState,
    formData: FormData,
  ) => Promise<CreateConsultantState>;
};

export default function AddConsultantForm({ action }: AddConsultantFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Form className="space-y-4" action={formAction}>
      <TextField name="name" type="text" isRequired>
        <Label className={labelClassName}>
          Full Name{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </Label>
        <div className="relative">
          <Badge
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-[#6d7a77]"
          />
          <Input
            autoComplete="name"
            placeholder="e.g., Dr. Marcus Vance, MD"
            className={inputClassName}
          />
        </div>
        <FieldError className={fieldErrorClassName} />
      </TextField>

      <TextField name="email" type="email" isRequired>
        <Label className={labelClassName}>
          Email Address{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-[#6d7a77]"
          />
          <Input
            autoComplete="email"
            placeholder="doctor@healthsync.com"
            className={inputClassName}
          />
        </div>
        <Text
          slot="description"
          className="mt-1 block text-[11px] text-[#6d7a77]"
        >
          Credentials &amp; onboarding invitation will be sent here.
        </Text>
        <FieldError className={fieldErrorClassName} />
      </TextField>

      <TextField name="password" type="password" isRequired>
        <Label className={labelClassName}>
          Temporary Password{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </Label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 my-auto size-5 text-[#6d7a77]"
          />
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            placeholder="Min. 8 characters with numbers"
            className={`${inputClassName} pr-10`}
          />
          <Button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onPress={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 grid w-10 cursor-pointer place-items-center rounded-r-xl text-[#6d7a77] outline-none transition data-hovered:text-[#0b1c30] data-focus-visible:ring-2 data-focus-visible:ring-inset data-focus-visible:ring-primary-container"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-5" />
            ) : (
              <Eye aria-hidden="true" className="size-5" />
            )}
          </Button>
        </div>
        <FieldError className={fieldErrorClassName} />
      </TextField>

      <Select
        name="specialty"
        isRequired
        placeholder="Select Medical Specialty"
      >
        <Label className={labelClassName}>
          Medical Specialty{" "}
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        </Label>
        <Button className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[#bcc9c6]/60 bg-surface py-2.5 pl-3.5 pr-3 text-left text-sm font-medium text-[#0b1c30] outline-none transition-all data-focus-visible:border-transparent data-focus-visible:ring-2 data-focus-visible:ring-primary-container data-invalid:border-red-600">
          <Stethoscope
            aria-hidden="true"
            className="size-5 shrink-0 text-[#6d7a77]"
          />
          <SelectValue className="min-w-0 flex-1 truncate data-placeholder:text-[#6d7a77]/60" />
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 text-[#6d7a77]"
          />
        </Button>
        <FieldError className={fieldErrorClassName} />
        <Popover className="w-(--trigger-width) overflow-hidden rounded-xl border border-[#bcc9c6]/60 bg-white p-1 shadow-lg outline-none">
          <ListBox className="max-h-64 overflow-auto outline-none">
            {specialties.map((specialty) => (
              <ListBoxItem
                key={specialty.id}
                id={specialty.id}
                textValue={specialty.name}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-[#0b1c30] outline-none data-focused:bg-[#eff4ff] data-selected:bg-[#d4eee9] data-selected:font-semibold"
              >
                {specialty.name}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#cbdbf5]/50 bg-[#eff4ff] p-3">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-[#0058be]"
        />
        <div className="text-xs text-[#3d4947]">
          <p className="font-medium text-[#0b1c30]">Consultant Permissions</p>
          <p className="mt-0.5 text-[11px]">
            This consultant will be authorized to accept video appointments,
            review triage notes, and issue prescriptions.
          </p>
        </div>
      </div>

      <div className="space-y-2.5 pt-3">
        {state.message && (
          <p
            role={state.success ? "status" : "alert"}
            className={`rounded-xl px-3 py-2 text-sm ${
              state.success
                ? "bg-[#d4eee9] text-primary-container"
                : "bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        )}

        <Button
          type="submit"
          isDisabled={isPending}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-container py-3 text-sm font-semibold text-white shadow-sm outline-none transition-all data-hovered:bg-[#008378] data-focus-visible:ring-2 data-focus-visible:ring-primary-container data-focus-visible:ring-offset-2 data-pressed:scale-[0.98]"
        >
          <UserPlus aria-hidden="true" className="size-4.5" />
          {isPending ? "Adding Consultant..." : "Add Consultant"}
        </Button>

        <Button
          type="button"
          className="w-full cursor-pointer rounded-xl bg-transparent py-2.5 text-center text-xs font-medium text-[#3d4947] outline-none transition-colors 
          data-hovered:bg-[#eff4ff] data-focus-visible:ring-2 data-focus-visible:ring-primary-container"
        >
          Cancel &amp; Return to Staff Directory
        </Button>
      </div>
    </Form>
  );
}
