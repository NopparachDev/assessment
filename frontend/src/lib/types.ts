export type WidgetType =
  | "TextInput"
  | "NumberInput"
  | "Dropdown"
  | "RadioGroup"
  | "CheckboxGroup"
  | "ScoreSlider"
  | "DatePicker"
  | "Label";

export interface WidgetOption {
  label: string;
  value: string;
}

export interface WidgetProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  scoring_weight?: number;
  // NumberInput / ScoreSlider
  min?: number;
  max?: number;
  step?: number;
  // Dropdown / RadioGroup / CheckboxGroup
  options?: WidgetOption[];
  // Label
  text?: string;
  variant?: "h1" | "h2" | "h3" | "body";
}

export interface Widget {
  id: string;
  type: WidgetType;
  col_start: number;
  col_span: number;
  props: WidgetProps;
}

export interface Row {
  id: string;
  widgets: Widget[];
}

export interface FormLayout {
  columns: number;
  rows: Row[];
}

export interface FormSchema {
  form_id?: string;
  title: string;
  department: string;
  version: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  layout: FormLayout;
  tags?: string[];
}

export const WIDGET_DEFAULTS: Record<WidgetType, Partial<WidgetProps>> = {
  TextInput: { label: "Text Input", placeholder: "Enter text...", required: false },
  NumberInput: { label: "Number Input", min: 0, max: 100, required: false },
  Dropdown: {
    label: "Dropdown",
    options: [
      { label: "Option 1", value: "option_1" },
      { label: "Option 2", value: "option_2" },
    ],
    required: false,
  },
  RadioGroup: {
    label: "Radio Group",
    options: [
      { label: "Option 1", value: "option_1" },
      { label: "Option 2", value: "option_2" },
    ],
    required: false,
  },
  CheckboxGroup: {
    label: "Checkbox Group",
    options: [
      { label: "Option 1", value: "option_1" },
      { label: "Option 2", value: "option_2" },
    ],
    required: false,
  },
  ScoreSlider: { label: "Score", min: 0, max: 10, step: 1, required: false, scoring_weight: 1 },
  DatePicker: { label: "Date", required: false },
  Label: { label: "Label", text: "Section Title", variant: "h2" },
};
