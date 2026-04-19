"use client";

import type { WidgetProps } from "@/lib/types";

export function LineWidget({ props }: { props: WidgetProps; interactive?: boolean }) {
  const isVertical = props.lineDirection === "vertical";

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: isVertical ? 20 : undefined }}
    >
      <div
        style={
          isVertical
            ? {
                width: 0,
                height: "100%",
                borderLeft: `${props.borderWidth || 1}px ${props.borderStyle || "solid"} ${props.borderColor || "#000"}`,
              }
            : {
                width: "100%",
                height: 0,
                borderTop: `${props.borderWidth || 1}px ${props.borderStyle || "solid"} ${props.borderColor || "#000"}`,
              }
        }
      />
    </div>
  );
}
