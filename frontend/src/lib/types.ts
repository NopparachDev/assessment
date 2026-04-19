export type WidgetType =
  | "TextInput"
  | "NumberInput"
  | "Dropdown"
  | "RadioGroup"
  | "CheckboxGroup"
  | "ScoreSlider"
  | "DatePicker"
  | "Label"
  | "ScoringTable"
  | "PatientInfo"
  | "ScoreSummary";

export interface WidgetOption {
  label: string;
  value: string;
}

// ScoringTable types
export interface ScoringColumn {
  header: string;
  subHeader?: string;
  score: number;
}

export interface ScoringRow {
  id: string;
  question: string;
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color?: string;
}

export interface PatientField {
  id: string;
  label: string;
  type: "text" | "date" | "number";
  width: "full" | "half" | "third";
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
  // ScoringTable
  tableTitle?: string;
  tableDescription?: string;
  columns?: ScoringColumn[];
  scoringRows?: ScoringRow[];
  // PatientInfo
  patientFields?: PatientField[];
  showBorder?: boolean;
  // ScoreSummary
  scoreRanges?: ScoreRange[];
  sourceWidgetId?: string;
  noteText?: string;
}

export interface Widget {
  id: string;
  type: WidgetType;
  // Freeform positioning (px on canvas)
  x: number;
  y: number;
  w: number;
  h: number;
  // Legacy grid support
  col_start?: number;
  col_span?: number;
  props: WidgetProps;
}

export interface FormLayout {
  canvasWidth: number;
  canvasHeight: number;
  widgets: Widget[];
}

// Default sizes per widget type (width x height in px)
export const WIDGET_SIZE_DEFAULTS: Record<WidgetType, { w: number; h: number }> = {
  TextInput: { w: 300, h: 60 },
  NumberInput: { w: 200, h: 60 },
  Dropdown: { w: 250, h: 60 },
  RadioGroup: { w: 250, h: 80 },
  CheckboxGroup: { w: 250, h: 80 },
  ScoreSlider: { w: 300, h: 80 },
  DatePicker: { w: 200, h: 60 },
  Label: { w: 200, h: 32 },
  ScoringTable: { w: 700, h: 250 },
  PatientInfo: { w: 700, h: 80 },
  ScoreSummary: { w: 400, h: 150 },
};

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
  ScoringTable: {
    label: "Scoring Table",
    tableTitle: "แบบคัดกรอง",
    tableDescription: "",
    columns: [
      { header: "ไม่มีเลย", score: 0 },
      { header: "เป็นบางวัน", subHeader: "1-7 วัน", score: 1 },
      { header: "เป็นบ่อย", subHeader: "> 7 วัน", score: 2 },
      { header: "เป็นทุกวัน", score: 3 },
    ],
    scoringRows: [
      { id: "q1", question: "คำถามข้อ 1" },
      { id: "q2", question: "คำถามข้อ 2" },
      { id: "q3", question: "คำถามข้อ 3" },
    ],
  },
  PatientInfo: {
    label: "Patient Info",
    showBorder: true,
    patientFields: [
      { id: "date", label: "วันที่", type: "date", width: "third" },
      { id: "name", label: "ชื่อ-สกุล", type: "text", width: "third" },
      { id: "age", label: "อายุ", type: "number", width: "third" },
      { id: "hn", label: "HN", type: "text", width: "half" },
      { id: "id_card", label: "เลขที่บัตรประชาชน", type: "text", width: "half" },
    ],
  },
  ScoreSummary: {
    label: "Score Summary",
    scoreRanges: [
      { min: 7, max: 12, label: "ระดับน้อย", color: "green" },
      { min: 13, max: 18, label: "ระดับปานกลาง", color: "yellow" },
      { min: 19, max: 27, label: "ระดับรุนแรง", color: "red" },
    ],
    noteText: "",
  },
};
