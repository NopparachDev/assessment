"use client";

import type { WidgetType, WidgetProps } from "@/lib/types";
import { TextInputWidget } from "./TextInputWidget";
import { NumberInputWidget } from "./NumberInputWidget";
import { DropdownWidget } from "./DropdownWidget";
import { RadioGroupWidget } from "./RadioGroupWidget";
import { CheckboxWidget } from "./CheckboxWidget";
import { CheckboxGroupWidget } from "./CheckboxGroupWidget";
import { ScoreSliderWidget } from "./ScoreSliderWidget";
import { DatePickerWidget } from "./DatePickerWidget";
import { LabelWidget } from "./LabelWidget";
import { RectangleWidget } from "./RectangleWidget";
import { LineWidget } from "./LineWidget";
import { ScoringTableWidget } from "./ScoringTableWidget";
import { PatientInfoWidget } from "./PatientInfoWidget";
import { ScoreSummaryWidget } from "./ScoreSummaryWidget";

const WIDGET_MAP: Record<WidgetType, React.ComponentType<{ props: WidgetProps; interactive?: boolean }>> = {
  TextInput: TextInputWidget,
  NumberInput: NumberInputWidget,
  Dropdown: DropdownWidget,
  RadioGroup: RadioGroupWidget,
  Checkbox: CheckboxWidget,
  CheckboxGroup: CheckboxGroupWidget,
  ScoreSlider: ScoreSliderWidget,
  DatePicker: DatePickerWidget,
  Label: LabelWidget,
  Rectangle: RectangleWidget,
  Line: LineWidget,
  ScoringTable: ScoringTableWidget,
  PatientInfo: PatientInfoWidget,
  ScoreSummary: ScoreSummaryWidget,
};

export function WidgetRenderer({
  type,
  props,
  interactive,
}: {
  type: WidgetType;
  props: WidgetProps;
  interactive?: boolean;
}) {
  const Component = WIDGET_MAP[type];
  if (!Component) return <div className="text-red-500">Unknown widget: {type}</div>;
  return <Component props={props} interactive={interactive} />;
}
