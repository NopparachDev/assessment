"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { WidgetProps } from "@/lib/types";

export function RadioGroupWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <RadioGroup disabled={!interactive} className="space-y-1">
        {(props.options || []).map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={opt.value} />
            <Label htmlFor={opt.value} className="font-normal cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
