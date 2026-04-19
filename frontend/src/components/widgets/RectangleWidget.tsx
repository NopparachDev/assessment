"use client";

import type { WidgetProps } from "@/lib/types";

export function RectangleWidget({ props }: { props: WidgetProps; interactive?: boolean }) {
  return (
    <div
      className="w-full h-full min-h-[20px]"
      style={{
        border: `${props.borderWidth || 1}px ${props.borderStyle || "solid"} ${props.borderColor || "#000"}`,
        borderRadius: props.borderRadius || 0,
        backgroundColor: props.fillColor || "transparent",
      }}
    />
  );
}
