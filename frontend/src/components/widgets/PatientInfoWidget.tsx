"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WidgetProps } from "@/lib/types";

const widthClass: Record<string, string> = {
  full: "w-full",
  half: "w-full sm:w-1/2",
  third: "w-full sm:w-1/3",
};

export function PatientInfoWidget({
  props,
  interactive,
}: {
  props: WidgetProps;
  interactive?: boolean;
}) {
  const fields = props.patientFields || [];

  return (
    <div
      className={cn(
        "p-3 rounded",
        props.showBorder && "border border-border"
      )}
    >
      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <div
            key={field.id}
            className={cn("flex items-center gap-1.5 min-w-0", widthClass[field.width] || "w-full")}
            style={{ flex: field.width === "full" ? "1 1 100%" : undefined }}
          >
            <label className="text-sm font-medium whitespace-nowrap shrink-0">
              {field.label}:
            </label>
            <Input
              type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
              className="h-7 text-sm flex-1 min-w-0"
              disabled={!interactive}
              readOnly={!interactive}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
