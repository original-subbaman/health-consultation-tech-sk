import { Label, Text, TextArea, TextField } from "react-aria-components";
import { useController, useFormContext } from "react-hook-form";
import { ConsultationFormValues } from "./consultation-form";
import {
  FormSection,
  RadioChoiceGroup,
  questionClassName,
  questionLabelClassName,
  descriptionClassName,
  textInputClassName,
} from "./FormControls";
import FormSectionHeader from "./FormSectionHeader";

function LifestyleSignals() {
  const { control } = useFormContext<ConsultationFormValues>();

  const { field: weightChange, fieldState: weightChangeState } = useController({
    control,
    name: "medicalHistory.lifestyle.recentWeightChange",
    rules: { required: "Select whether your weight changed recently." },
  });
  const { field: smoking, fieldState: smokingState } = useController({
    control,
    name: "medicalHistory.lifestyle.smoking",
    rules: { required: "Select your smoking status." },
  });
  const { field: alcohol, fieldState: alcoholState } = useController({
    control,
    name: "medicalHistory.lifestyle.alcohol",
    rules: { required: "Select your alcohol use." },
  });
  const { field: additionalNotes } = useController({
    control,
    name: "medicalHistory.lifestyle.additionalNotes",
  });

  return (
    <FormSection>
      <FormSectionHeader
        heading="Lifestyle Signals"
        subheading="Daily habits and recent changes"
        helper="Share details about smoking, alcohol use, recent weight changes, dietary restrictions, and major life changes that may affect your health."
      />

      <RadioChoiceGroup
        error={weightChangeState.error?.message}
        label="Recent weight change (&gt;5 kg / 10 lbs)?"
        name={weightChange.name}
        onBlur={weightChange.onBlur}
        onChange={weightChange.onChange}
        options={[
          ["yes", "Yes"],
          ["no", "No"],
        ]}
        value={weightChange.value}
        isInvalid={weightChangeState.invalid}
      />

      <RadioChoiceGroup
        error={smokingState.error?.message}
        label="Smoking"
        name={smoking.name}
        onBlur={smoking.onBlur}
        onChange={smoking.onChange}
        options={[
          ["never", "Never"],
          ["former", "Former"],
          ["current", "Current"],
        ]}
        value={smoking.value}
        isInvalid={smokingState.invalid}
      />

      <RadioChoiceGroup
        error={alcoholState.error?.message}
        label="Alcohol"
        name={alcohol.name}
        onBlur={alcohol.onBlur}
        onChange={alcohol.onChange}
        options={[
          ["none", "None"],
          ["occasional", "Occasional"],
          ["regular", "Regular"],
        ]}
        value={alcohol.value}
        isInvalid={alcoholState.invalid}
      />

      <TextField
        className={questionClassName}
        name={additionalNotes.name}
        onBlur={additionalNotes.onBlur}
        onChange={additionalNotes.onChange}
        value={additionalNotes.value}
      >
        <Label className={questionLabelClassName}>
          Is there anything else we should know about you that might impact your
          health?
        </Label>
        <Text className={descriptionClassName} slot="description">
          Include dietary restrictions or major life changes.
        </Text>
        <TextArea className={textInputClassName} maxLength={1000} rows={4} />
      </TextField>
    </FormSection>
  );
}

export default LifestyleSignals;
