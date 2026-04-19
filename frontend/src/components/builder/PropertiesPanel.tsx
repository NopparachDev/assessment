"use client";

import { useFormStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Widget, WidgetOption, ScoringColumn, ScoringRow, ScoreRange, PatientField } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

function OptionEditor({
  options,
  onChange,
}: {
  options: WidgetOption[];
  onChange: (options: WidgetOption[]) => void;
}) {
  const addOption = () => {
    const idx = options.length + 1;
    onChange([...options, { label: `Option ${idx}`, value: `option_${idx}` }]);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: "label" | "value", val: string) => {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, [field]: val } : opt
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Options</Label>
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-1">
          <Input
            value={opt.label}
            onChange={(e) => updateOption(i, "label", e.target.value)}
            className="h-8 text-xs"
            placeholder="Label"
          />
          <Input
            value={opt.value}
            onChange={(e) => updateOption(i, "value", e.target.value)}
            className="h-8 text-xs w-24"
            placeholder="Value"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => removeOption(i)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addOption}>
        <Plus className="h-3 w-3 mr-1" /> Add Option
      </Button>
    </div>
  );
}

/* ── ScoringTable editors ── */

function ScoringColumnsEditor({
  columns,
  onChange,
}: {
  columns: ScoringColumn[];
  onChange: (columns: ScoringColumn[]) => void;
}) {
  const add = () =>
    onChange([...columns, { header: "New Column", score: columns.length }]);

  const remove = (i: number) => onChange(columns.filter((_, idx) => idx !== i));

  const update = (i: number, field: keyof ScoringColumn, val: string | number) => {
    const updated = columns.map((c, idx) =>
      idx === i ? { ...c, [field]: val } : c
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Score Columns</Label>
      {columns.map((col, i) => (
        <div key={i} className="space-y-1 rounded border border-border p-2">
          <Input
            value={col.header}
            onChange={(e) => update(i, "header", e.target.value)}
            className="h-7 text-xs"
            placeholder="Header"
          />
          <Input
            value={col.subHeader || ""}
            onChange={(e) => update(i, "subHeader", e.target.value)}
            className="h-7 text-xs"
            placeholder="Sub-header (optional)"
          />
          <div className="flex items-center gap-1">
            <Label className="text-[10px] w-12">Score:</Label>
            <Input
              type="number"
              value={col.score}
              onChange={(e) => update(i, "score", Number(e.target.value))}
              className="h-7 text-xs w-16"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 ml-auto shrink-0"
              onClick={() => remove(i)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Column
      </Button>
    </div>
  );
}

function ScoringRowsEditor({
  rows,
  onChange,
}: {
  rows: ScoringRow[];
  onChange: (rows: ScoringRow[]) => void;
}) {
  const add = () =>
    onChange([...rows, { id: `q${rows.length + 1}`, question: `คำถามข้อ ${rows.length + 1}` }]);

  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  const update = (i: number, val: string) => {
    const updated = rows.map((r, idx) =>
      idx === i ? { ...r, question: val } : r
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Questions ({rows.length})</Label>
      {rows.map((row, i) => (
        <div key={row.id} className="flex items-start gap-1">
          <span className="text-xs text-muted-foreground mt-2 w-4 shrink-0">{i + 1}.</span>
          <Textarea
            value={row.question}
            onChange={(e) => update(i, e.target.value)}
            className="text-xs min-h-[32px] resize-none"
            rows={1}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => remove(i)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Question
      </Button>
    </div>
  );
}

/* ── PatientInfo field editor ── */

function PatientFieldsEditor({
  fields,
  onChange,
}: {
  fields: PatientField[];
  onChange: (fields: PatientField[]) => void;
}) {
  const add = () =>
    onChange([...fields, { id: `field_${fields.length + 1}`, label: "New Field", type: "text", width: "half" }]);

  const remove = (i: number) => onChange(fields.filter((_, idx) => idx !== i));

  const update = (i: number, field: Partial<PatientField>) => {
    const updated = fields.map((f, idx) =>
      idx === i ? { ...f, ...field } : f
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Fields</Label>
      {fields.map((f, i) => (
        <div key={f.id} className="space-y-1 rounded border border-border p-2">
          <Input
            value={f.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="h-7 text-xs"
            placeholder="Label"
          />
          <div className="flex items-center gap-1">
            <Select
              value={f.type}
              onValueChange={(v) => update(i, { type: v as "text" | "date" | "number" })}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={f.width}
              onValueChange={(v) => update(i, { width: v as "full" | "half" | "third" })}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="half">Half</SelectItem>
                <SelectItem value="third">Third</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Field
      </Button>
    </div>
  );
}

/* ── ScoreSummary range editor ── */

function ScoreRangesEditor({
  ranges,
  onChange,
}: {
  ranges: ScoreRange[];
  onChange: (ranges: ScoreRange[]) => void;
}) {
  const add = () =>
    onChange([...ranges, { min: 0, max: 10, label: "New Range", color: "blue" }]);

  const remove = (i: number) => onChange(ranges.filter((_, idx) => idx !== i));

  const update = (i: number, field: Partial<ScoreRange>) => {
    const updated = ranges.map((r, idx) =>
      idx === i ? { ...r, ...field } : r
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Score Ranges</Label>
      {ranges.map((r, i) => (
        <div key={i} className="space-y-1 rounded border border-border p-2">
          <Input
            value={r.label}
            onChange={(e) => update(i, { label: e.target.value })}
            className="h-7 text-xs"
            placeholder="Label"
          />
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={r.min}
              onChange={(e) => update(i, { min: Number(e.target.value) })}
              className="h-7 text-xs w-14"
              placeholder="Min"
            />
            <span className="text-xs">-</span>
            <Input
              type="number"
              value={r.max}
              onChange={(e) => update(i, { max: Number(e.target.value) })}
              className="h-7 text-xs w-14"
              placeholder="Max"
            />
            <Select
              value={r.color || "blue"}
              onValueChange={(v) => update(i, { color: v })}
            >
              <SelectTrigger className="h-7 text-xs flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => remove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={add}>
        <Plus className="h-3 w-3 mr-1" /> Add Range
      </Button>
    </div>
  );
}

/* ── Main PropertiesPanel ── */

export function PropertiesPanel() {
  const { form, selectedWidgetId, updateWidgetProps, moveWidget, resizeWidget } = useFormStore();

  const selectedWidget: Widget | undefined = form.layout.widgets
    .find((w) => w.id === selectedWidgetId);

  if (!selectedWidget) {
    return (
      <div className="w-72 shrink-0 border-l bg-muted/30 p-4">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Properties
        </h2>
        <p className="text-sm text-muted-foreground">Select a widget to edit its properties</p>
      </div>
    );
  }

  const { props, type } = selectedWidget;
  const hasOptions = ["Dropdown", "RadioGroup", "CheckboxGroup"].includes(type);
  const hasMinMax = ["NumberInput", "ScoreSlider"].includes(type);
  const isLabel = type === "Label";
  const isBasicWidget = !["ScoringTable", "PatientInfo", "ScoreSummary", "Label"].includes(type);
  const isScoringTable = type === "ScoringTable";
  const isPatientInfo = type === "PatientInfo";
  const isScoreSummary = type === "ScoreSummary";

  return (
    <div className="w-72 shrink-0 border-l bg-muted/30 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Properties
      </h2>

      <div className="space-y-4">
        {/* Widget type */}
        <div className="rounded bg-muted px-2 py-1 text-xs font-medium text-center">
          {type}
        </div>

        {/* Label */}
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={props.label || ""}
            onChange={(e) => updateWidgetProps(selectedWidget.id, { label: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        {/* ── ScoringTable properties ── */}
        {isScoringTable && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Table Title</Label>
              <Input
                value={props.tableTitle || ""}
                onChange={(e) => updateWidgetProps(selectedWidget.id, { tableTitle: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={props.tableDescription || ""}
                onChange={(e) => updateWidgetProps(selectedWidget.id, { tableDescription: e.target.value })}
                className="text-sm min-h-[48px] resize-none"
                rows={2}
              />
            </div>
            <Separator />
            <ScoringColumnsEditor
              columns={props.columns || []}
              onChange={(columns) => updateWidgetProps(selectedWidget.id, { columns })}
            />
            <Separator />
            <ScoringRowsEditor
              rows={props.scoringRows || []}
              onChange={(scoringRows) => updateWidgetProps(selectedWidget.id, { scoringRows })}
            />
          </>
        )}

        {/* ── PatientInfo properties ── */}
        {isPatientInfo && (
          <>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Show Border</Label>
              <Switch
                checked={props.showBorder ?? true}
                onCheckedChange={(checked) =>
                  updateWidgetProps(selectedWidget.id, { showBorder: checked })
                }
              />
            </div>
            <Separator />
            <PatientFieldsEditor
              fields={props.patientFields || []}
              onChange={(patientFields) => updateWidgetProps(selectedWidget.id, { patientFields })}
            />
          </>
        )}

        {/* ── ScoreSummary properties ── */}
        {isScoreSummary && (
          <>
            <Separator />
            <ScoreRangesEditor
              ranges={props.scoreRanges || []}
              onChange={(scoreRanges) => updateWidgetProps(selectedWidget.id, { scoreRanges })}
            />
            <Separator />
            <div className="space-y-1">
              <Label className="text-xs">Note Text</Label>
              <Textarea
                value={props.noteText || ""}
                onChange={(e) => updateWidgetProps(selectedWidget.id, { noteText: e.target.value })}
                className="text-sm min-h-[48px] resize-none"
                rows={2}
                placeholder="หมายเหตุ..."
              />
            </div>
          </>
        )}

        {/* ── Label widget properties ── */}
        {isLabel && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Text</Label>
              <Input
                value={props.text || ""}
                onChange={(e) => updateWidgetProps(selectedWidget.id, { text: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Variant</Label>
              <Select
                value={props.variant || "h2"}
                onValueChange={(val) =>
                  updateWidgetProps(selectedWidget.id, {
                    variant: val as "h1" | "h2" | "h3" | "body",
                  })
                }
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="body">Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* ── Basic widget properties ── */}
        {isBasicWidget && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Placeholder</Label>
              <Input
                value={props.placeholder || ""}
                onChange={(e) => updateWidgetProps(selectedWidget.id, { placeholder: e.target.value })}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Required</Label>
              <Switch
                checked={props.required || false}
                onCheckedChange={(checked) =>
                  updateWidgetProps(selectedWidget.id, { required: checked })
                }
              />
            </div>
          </>
        )}

        <Separator />

        {/* Position & Size */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Position & Size</Label>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="space-y-0.5">
              <Label className="text-[10px] text-muted-foreground">X</Label>
              <Input
                type="number"
                value={Math.round(selectedWidget.x)}
                onChange={(e) => moveWidget(selectedWidget.id, Number(e.target.value), selectedWidget.y)}
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[10px] text-muted-foreground">Y</Label>
              <Input
                type="number"
                value={Math.round(selectedWidget.y)}
                onChange={(e) => moveWidget(selectedWidget.id, selectedWidget.x, Number(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[10px] text-muted-foreground">W</Label>
              <Input
                type="number"
                value={Math.round(selectedWidget.w)}
                onChange={(e) => resizeWidget(selectedWidget.id, Number(e.target.value), selectedWidget.h)}
                className="h-7 text-xs"
              />
            </div>
            <div className="space-y-0.5">
              <Label className="text-[10px] text-muted-foreground">H</Label>
              <Input
                type="number"
                value={Math.round(selectedWidget.h)}
                onChange={(e) => resizeWidget(selectedWidget.id, selectedWidget.w, Number(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Min/Max for number-like widgets */}
        {hasMinMax && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Min</Label>
                <Input
                  type="number"
                  value={props.min ?? 0}
                  onChange={(e) =>
                    updateWidgetProps(selectedWidget.id, { min: Number(e.target.value) })
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max</Label>
                <Input
                  type="number"
                  value={props.max ?? 100}
                  onChange={(e) =>
                    updateWidgetProps(selectedWidget.id, { max: Number(e.target.value) })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>
            {type === "ScoreSlider" && (
              <div className="space-y-1">
                <Label className="text-xs">Step</Label>
                <Input
                  type="number"
                  value={props.step ?? 1}
                  onChange={(e) =>
                    updateWidgetProps(selectedWidget.id, { step: Number(e.target.value) })
                  }
                  className="h-8 text-sm"
                />
              </div>
            )}
          </>
        )}

        {/* Scoring weight */}
        {isBasicWidget && (
          <>
            <Separator />
            <div className="space-y-1">
              <Label className="text-xs">Scoring Weight</Label>
              <Input
                type="number"
                value={props.scoring_weight ?? 0}
                onChange={(e) =>
                  updateWidgetProps(selectedWidget.id, {
                    scoring_weight: Number(e.target.value),
                  })
                }
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {/* Options editor */}
        {hasOptions && (
          <>
            <Separator />
            <OptionEditor
              options={props.options || []}
              onChange={(options) => updateWidgetProps(selectedWidget.id, { options })}
            />
          </>
        )}
      </div>
    </div>
  );
}
