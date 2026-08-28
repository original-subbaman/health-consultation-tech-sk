"use client";
import { Eye, EyeOff } from "lucide-react";
import { registerPatient, type RegistrationState } from "@/actions/auth";
import { useActionState, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";

const initialState: RegistrationState = {};

const fieldClassName =
  "mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline data-[focused]:border-primary data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[invalid]:border-error data-[invalid]:ring-3 data-[invalid]:ring-error-container";
const labelClassName = "text-label-md text-on-surface";
const errorClassName = "mt-1.5 text-sm text-error";

export function PatientRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    registerPatient,
    initialState,
  );

  return (
    <Form
      action={formAction}
      validationErrors={state.fieldErrors}
      className="mt-3 space-y-3"
    >
      <TextField name="name" type="text" isRequired>
        <Label className={labelClassName}>Full name</Label>
        <Input
          autoComplete="name"
          placeholder="Enter your full name"
          className={fieldClassName}
        />
        <FieldError className={errorClassName} />
      </TextField>

      <TextField name="email" type="email" isRequired>
        <Label className={labelClassName}>Email address</Label>
        <Input
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClassName}
        />
        <FieldError className={errorClassName} />
      </TextField>

      <TextField name="dob" type="date" isRequired>
        <Label className={labelClassName}>Date of birth</Label>
        <Input autoComplete="bday" className={fieldClassName} />
        <FieldError className={errorClassName} />
      </TextField>

      <TextField name="password" type="password" isRequired>
        <Label className={labelClassName}>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            className={fieldClassName}
          />
          <Button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onPress={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 mt-2 grid w-12 cursor-pointer place-items-center rounded-r-lg text-on-surface-variant outline-none transition data-[hovered]:text-primary data-[focused]:ring-2 data-[focused]:ring-inset data-[focused]:ring-primary"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <FieldError className={errorClassName} />
      </TextField>

      {state?.success && (
        <p
          role="alert"
          className="text-center rounded-lg bg-green-300 px-4 py-3 text-sm"
        >
          Success! A verification link as been sent to your email
        </p>
      )}

      <Button
        isDisabled={isPending}
        type="submit"
        className="w-full cursor-pointer rounded-lg bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-ambient outline-none transition data-[hovered]:-translate-y-0.5 data-[hovered]:shadow-ambient-hover data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[pressed]:translate-y-0"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </Button>
    </Form>
  );
}
