"use client";

import { useFormStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Widget, WidgetOption } from "@/lib/types";
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

export function PropertiesPanel() {
  const { form, selectedWidgetId, updateWidgetProps, updateWidgetLayout } = useFormStore();

  const selectedWidget: Widget | undefined = form.layout.rows
    .flatMap((r) => r.widgets)
    .find((w) => w.id === selectedWidgetId);

  if (!selectedWidget) {
    return (
      <div className="w-64 shrink-0 border-l bg-muted/30 p-4">
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

  return (
    <div className="w-64 shrink-0 border-l bg-muted/30 p-4 overflow-y-auto">
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

        {/* Text (for Label widget) */}
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

        {/* Placeholder */}
        {!isLabel && (
          <div className="space-y-1">
            <Label className="text-xs">Placeholder</Label>
            <Input
              value={props.placeholder || ""}
              onChange={(e) => updateWidgetProps(selectedWidget.id, { placeholder: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        )}

        {/* Required */}
        {!isLabel && (
          <div className="flex items-center justify-between">
            <Label className="text-xs">Required</Label>
            <Switch
              checked={props.required || false}
              onCheckedChange={(checked) =>
                updateWidgetProps(selectedWidget.id, { required: checked })
              }
            />
          </div>
        )}

        <Separator />

        {/* Column Span */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <Label className="text-xs">Width</Label>
            <span className="text-xs text-muted-foreground">
              {selectedWidget.col_span}/12 cols
            </span>
          </div>
          <Slider
            min={1}
            max={12}
            step={1}
            value={[selectedWidget.col_span]}
            onValueChange={([val]) => updateWidgetLayout(selectedWidget.id, val)}
          />
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
        {!isLabel && (
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
