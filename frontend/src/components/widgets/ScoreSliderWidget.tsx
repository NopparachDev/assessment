"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { WidgetProps } from "@/lib/types";

export function ScoreSliderWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  const min = props.min ?? 0;
  const max = props.max ?? 10;
  const step = props.step ?? 1;
  const [value, setValue] = useState([min]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {props.label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <span className="text-sm font-medium tabular-nums">{value[0]}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={interactive ? setValue : undefined}
        disabled={!interactive}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
