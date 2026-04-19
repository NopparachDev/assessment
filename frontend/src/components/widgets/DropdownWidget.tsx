"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WidgetProps } from "@/lib/types";

export function DropdownWidget({ props, interactive }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select disabled={!interactive}>
        <SelectTrigger>
          <SelectValue placeholder={props.placeholder || "Select..."} />
        </SelectTrigger>
        <SelectContent>
          {(props.options || []).map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
