"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { WidgetProps } from "@/lib/types";

export function CheckboxWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={props.label} disabled={!interactive} />
      <Label htmlFor={props.label} className="font-normal cursor-pointer text-sm">
        {props.text || props.label}
      </Label>
    </div>
  );
}
