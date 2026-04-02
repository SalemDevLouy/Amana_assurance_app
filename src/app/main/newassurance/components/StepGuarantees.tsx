import {
  Card,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Description,
  Label,
  Radio,
  RadioGroup,
} from "@heroui/react";
import { AssuranceType, GuaranteeGroup, GuaranteeSelections } from "../types";

type StepGuaranteeProps = Readonly<{
  assuranceType: AssuranceType;
  guaranteeGroups: GuaranteeGroup[];
  selections: GuaranteeSelections;
  isLoading: boolean;
  error: string | null;
  onCheckboxChange: (groupKey: string, values: string[]) => void;
  onSelectGroupChange: (groupKey: string, value: string) => void;
}>;

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (value && typeof value === "object" && "target" in value) {
    const targetValue = (value as { target?: { value?: unknown } }).target?.value;
    if (Array.isArray(targetValue)) {
      return targetValue.filter((item): item is string => typeof item === "string");
    }

    if (typeof targetValue === "string") {
      return [targetValue];
    }
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
}

function toSingleString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "target" in value) {
    const targetValue = (value as { target?: { value?: unknown } }).target?.value;
    if (typeof targetValue === "string") {
      return targetValue;
    }
  }

  return "";
}

export default function StepGuarantees({
  assuranceType,
  guaranteeGroups,
  selections,
  isLoading,
  error,
  onCheckboxChange,
  onSelectGroupChange,
}: StepGuaranteeProps) {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Chargement des garanties...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!guaranteeGroups.length) {
    return <p className="text-sm text-gray-500">Aucune garantie disponible pour ce type.</p>;
  }

  const title = assuranceType === "farmer" ? "3-Les garanties Agricole :" : "3. Les garanties Automobile";

  if (assuranceType === "farmer") {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">
          La responsabilite civile est obligatoire. Les autres garanties sont facultatives.
        </p>

        {guaranteeGroups.map((group) => {
          const isMandatory = group.mandatory;
          const selectedValues = selections[group.key] ?? [];

          return (
            <Card
              key={group.id}
              className={isMandatory ? "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50" : "mt-4 rounded-2xl border border-gray-200 bg-white"}
            >
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">{group.title}</CardHeader>
              <div className="space-y-2 px-4 pb-4 pt-2">
                <CheckboxGroup
                  name={group.key}
                  value={selectedValues}
                  onChange={(values) => onCheckboxChange(group.key, toStringArray(values))}
                  isDisabled={isMandatory}
                >
                  <Label>{group.title}</Label>
                  <Description>{group.description ?? "Choisissez toutes les options qui s'appliquent."}</Description>
                  {group.options.map((option) => (
                    <Checkbox key={option.id} value={option.id}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <Label>{option.label}</Label>
                        <Description>{option.price > 0 ? `${option.price} DA` : "Inclus"}</Description>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        La responsabilite civile est obligatoire. Les autres garanties sont facultatives.
      </p>

      {guaranteeGroups.map((group) => {
        const selectedValues = selections[group.key] ?? [];
        const selectedValue = selectedValues[0] ?? "";
        const isMandatory = group.mandatory;

        if (group.inputType === "checkbox") {
          return (
            <Card
              key={group.id}
              className={isMandatory ? "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50" : "mt-4 rounded-2xl border border-gray-200 bg-white"}
            >
              <CardHeader className="pb-1 text-sm font-semibold text-gray-700">{group.title}</CardHeader>
              <div className="space-y-2 px-4 pb-4 pt-2">
                <CheckboxGroup
                  name={group.key}
                  value={selectedValues}
                  onChange={(values) => onCheckboxChange(group.key, toStringArray(values))}
                  isDisabled={isMandatory}
                >
                  <Label>{group.title}</Label>
                  <Description>{group.description ?? "Choisissez toutes les options qui s'appliquent."}</Description>
                  {group.options.map((option) => (
                    <Checkbox key={option.id} value={option.id}>
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <Label>{option.label}</Label>
                        <Description>{option.price > 0 ? `${option.price} DA` : "Inclus"}</Description>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            </Card>
          );
        }

        return (
          <Card key={group.id} className="mt-4 rounded-2xl border border-gray-200 bg-white">
            <CardHeader className="pb-1 text-sm font-semibold text-gray-700">{group.title}</CardHeader>
            <div className="space-y-2 px-4 pb-4 pt-2">
              <RadioGroup
                name={group.key}
                value={selectedValue}
                onChange={(value) => onSelectGroupChange(group.key, toSingleString(value))}
              >
                <Label>{group.title}</Label>
                <Description>{group.description ?? "Selectionnez une option."}</Description>
                {group.options.map((option) => (
                  <Radio key={option.id} value={option.id}>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <Radio.Content>
                      <Label>{option.label}</Label>
                      <Description>{option.price > 0 ? `${option.price} DA` : "Inclus"}</Description>
                    </Radio.Content>
                  </Radio>
                ))}
              </RadioGroup>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
