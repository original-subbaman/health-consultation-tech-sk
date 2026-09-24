import type { ReactNode } from "react";
import {
  Checkbox,
  FieldError,
  Label,
  RadioButton,
  RadioField,
  RadioGroup,
  Text,
} from "react-aria-components";
import { Check } from "lucide-react";
import RequiredMark from "./RequiredMark";

export const formSectionClassName =
  "flex flex-col gap-8 rounded-xl bg-surface-container-lowest p-5 shadow-sm sm:p-8";
export const questionClassName = "flex flex-col gap-3";
export const questionLabelClassName =
  "font-headline-md text-lg text-on-surface";
export const descriptionClassName =
  "text-label-md text-on-surface-variant";
export const textInputClassName =
  "w-full rounded-lg bg-surface-container-low px-4 py-3 text-body-md text-on-surface outline-none transition-all placeholder:text-outline data-[focused]:bg-surface-container-lowest data-[focused]:shadow-md data-[focus-visible]:ring-3 data-[focus-visible]:ring-primary-fixed/60 data-[invalid]:ring-2 data-[invalid]:ring-error";
export const errorClassName = "text-label-sm text-error";

export function FormSection({ children }: { children: ReactNode }) {
  return <section className={formSectionClassName}>{children}</section>;
}

export function getExclusiveNoneValues(
  values: string[],
  previousValues: string[],
) {
  const selectedNone = values.includes("none");
  const noneWasSelected = previousValues.includes("none");

  if (selectedNone && !noneWasSelected) {
    return ["none"];
  }

  return values.filter((value) => value !== "none");
}

export function ChoiceCheckbox({
  children,
  safe = false,
  surface = "low",
  value,
}: {
  children: ReactNode;
  safe?: boolean;
  surface?: "low" | "lowest";
  value: string;
}) {
  const standardClassName =
    surface === "lowest"
      ? "bg-surface-container-lowest text-on-surface data-hovered:bg-surface-container-high"
      : "bg-surface-container-low text-on-surface data-hovered:bg-surface-container";

  return (
    <Checkbox
      className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-label-md outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 ${
        safe
          ? "bg-primary/10 font-semibold text-primary data-hovered:bg-primary/20"
          : standardClassName
      }`}
      value={value}
    >
      <span className="grid size-4 shrink-0 place-items-center rounded border border-outline bg-surface text-transparent transition group-data-selected:border-primary group-data-selected:bg-primary group-data-selected:text-on-primary">
        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
      </span>
      {children}
    </Checkbox>
  );
}

type RadioChoiceOption = string | readonly [string, string];

export function RadioChoiceGroup({
  buttonClassName = "px-4",
  description,
  error,
  gridClassName = "grid grid-cols-2 gap-2.5 sm:grid-cols-3",
  isInvalid,
  label,
  name,
  onBlur,
  onChange,
  options,
  value,
}: {
  buttonClassName?: string;
  description?: string;
  error?: string;
  gridClassName?: string;
  isInvalid: boolean;
  label: ReactNode;
  name: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  options: ReadonlyArray<RadioChoiceOption>;
  value: string;
}) {
  return (
    <RadioGroup
      className={questionClassName}
      name={name}
      onBlur={onBlur}
      onChange={onChange}
      value={value}
      isInvalid={isInvalid}
      isRequired
    >
      <Label className={questionLabelClassName}>
        {label} <RequiredMark />
      </Label>
      {description && (
        <Text className={descriptionClassName} slot="description">
          {description}
        </Text>
      )}
      <div className={gridClassName}>
        {options.map((option) => {
          const [optionValue, optionLabel] =
            typeof option === "string" ? [option, option] : option;

          return (
            <RadioField
              className="contents"
              key={optionValue}
              value={optionValue}
            >
              <RadioButton
                className={`cursor-pointer rounded-lg bg-surface-container-low py-3 text-center text-label-md font-medium text-on-surface outline-none transition-colors data-focus-visible:ring-3 data-focus-visible:ring-primary-fixed/60 data-hovered:bg-surface-container data-selected:bg-primary data-selected:font-semibold data-selected:text-on-primary data-selected:shadow-sm ${buttonClassName}`}
              >
                {optionLabel}
              </RadioButton>
            </RadioField>
          );
        })}
      </div>
      <FieldError className={errorClassName}>{error}</FieldError>
    </RadioGroup>
  );
}
