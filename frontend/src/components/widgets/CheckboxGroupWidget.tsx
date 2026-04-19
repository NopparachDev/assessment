"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { WidgetProps } from "@/lib/types";

export function CheckboxGroupWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="space-y-1">
        {(props.options || []).map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <Checkbox id={opt.value} disabled={!interactive} />
            <Label htmlFor={opt.value} className="font-normal cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
