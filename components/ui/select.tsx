"use client";

import { ChevronDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  type PopoverProps,
  type SelectProps as AriaSelectProps,
} from "react-aria-components";

export type SelectOption = {
  id: string | number;
  label: string;
  isDisabled?: boolean;
};

export type SelectProps<
  T extends SelectOption = SelectOption,
  M extends "single" | "multiple" = "single",
> = Omit<
  AriaSelectProps<T, M>,
  "children" | "items" | "className"
> & {
  label?: ReactNode;
  options: readonly T[];
  renderOption?: (option: T) => ReactNode;
  placement?: PopoverProps["placement"];
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  listBoxClassName?: string;
  optionClassName?: string;
};

/** A select whose menu matches the width of the label and button. */
export function Select<
  T extends SelectOption = SelectOption,
  M extends "single" | "multiple" = "single",
>({
  label,
  options,
  renderOption,
  placement = "bottom end",
  className = "",
  labelClassName = "",
  buttonClassName = "",
  popoverClassName = "",
  listBoxClassName = "",
  optionClassName = "",
  ...props
}: SelectProps<T, M>) {
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <AriaSelect
      {...props}
      ref={triggerRef}
      className={`flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 text-on-surface-variant data-disabled:opacity-50 ${className}`}
    >
      {label != null && (
        <Label className={`font-label-sm text-label-sm font-medium ${labelClassName}`}>
          {label}
        </Label>
      )}
      <Button
        type="button"
        className={`flex cursor-pointer items-center gap-2 rounded-md bg-transparent font-label-sm text-label-sm text-on-surface outline-none data-focus-visible:ring-2 data-focus-visible:ring-primary data-disabled:cursor-default ${buttonClassName}`}
      >
        <SelectValue />
        <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
      </Button>
      <Popover
        triggerRef={triggerRef}
        placement={placement}
        className={`w-(--trigger-width) rounded-xl bg-surface-container-lowest p-1 shadow-lg ring-1 ring-outline/20 outline-none ${popoverClassName}`}
      >
        <ListBox items={options} className={`outline-none ${listBoxClassName}`}>
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              isDisabled={option.isDisabled}
              className={`cursor-pointer rounded-lg px-3 py-2 font-label-sm text-label-sm text-on-surface outline-none data-focused:bg-surface-container-high data-selected:bg-primary-container data-selected:text-on-primary-container data-disabled:cursor-default data-disabled:opacity-50 ${optionClassName}`}
            >
              {renderOption ? renderOption(option) : option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
