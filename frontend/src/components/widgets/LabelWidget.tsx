"use client";

import { cn } from "@/lib/utils";
import type { WidgetProps } from "@/lib/types";

const variantClasses: Record<string, string> = {
  h1: "text-2xl font-bold",
  h2: "text-xl font-semibold",
  h3: "text-lg font-medium",
  body: "text-base",
};

export function LabelWidget({ props }: { props: WidgetProps }) {
  const variant = props.variant || "h2";
  return (
    <div className={cn(variantClasses[variant] || variantClasses.body)}>
      {props.text || props.label}
    </div>
  );
}
