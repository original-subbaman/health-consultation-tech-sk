"use client";

import { loginAdmin, type LoginState } from "@/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";

const initialState: LoginState = {};

const fieldClassName =
  "mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline data-[focused]:border-primary data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[invalid]:border-error data-[invalid]:ring-3 data-[invalid]:ring-error-container";

const labelClassName = "text-label-md text-on-surface";
const errorClassName = "mt-1.5 text-sm text-error";

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <Form
      action={formAction}
      validationErrors={state.fieldErrors}
      className="mt-8 space-y-5"
    >
      <TextField name="email" type="email" isRequired>
        <Label className={labelClassName}>Email address</Label>
        <Input
          autoComplete="email"
          placeholder="admin@example.com"
          className={fieldClassName}
        />
        <FieldError className={errorClassName} />
      </TextField>

      <TextField name="password" type="password" isRequired minLength={8}>
        <div className="flex items-center justify-between gap-4">
          <Label className={labelClassName}>Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary transition hover:text-primary-container hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
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

      {state.message && (
        <p
          role="alert"
          className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container"
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        isDisabled={pending}
        className="w-full cursor-pointer rounded-lg bg-primary px-6 py-3.5 text-label-md text-on-primary shadow-ambient outline-none transition data-[hovered]:-translate-y-0.5 data-[hovered]:shadow-ambient-hover data-[focused]:ring-3 data-[focused]:ring-primary-fixed/60 data-[pressed]:translate-y-0 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </Form>
  );
}
