"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WidgetProps } from "@/lib/types";

export function NumberInputWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type="number"
        min={props.min}
        max={props.max}
        step={props.step}
        placeholder={props.placeholder || ""}
        disabled={!interactive}
        readOnly={!interactive}
      />
    </div>
  );
}
