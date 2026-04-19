"use client";

import { cn } from "@/lib/utils";
import type { WidgetProps } from "@/lib/types";

const colorMap: Record<string, string> = {
  green: "bg-green-100 text-green-800 border-green-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  orange: "bg-orange-100 text-orange-800 border-orange-300",
  red: "bg-red-100 text-red-800 border-red-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
};

export function ScoreSummaryWidget({
  props,
  interactive,
}: {
  props: WidgetProps;
  interactive?: boolean;
}) {
  const ranges = props.scoreRanges || [];

  return (
    <div className="space-y-3">
      {/* Score ranges */}
      <div className="space-y-1">
        {ranges.map((range, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 rounded border px-3 py-1 text-sm",
              colorMap[range.color || "blue"] || colorMap.blue
            )}
          >
            <span className="font-semibold tabular-nums">
              {range.min}-{range.max} คะแนน
            </span>
            <span>{range.label}</span>
          </div>
        ))}
      </div>

      {/* Total score display */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-sm font-semibold">รวมคะแนน</span>
        <div className="border-2 border-foreground/30 rounded px-4 py-1.5 min-w-[80px] text-center bg-background">
          {interactive ? (
            <input
              type="number"
              className="w-full text-center text-lg font-bold bg-transparent outline-none"
              placeholder="0"
            />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">—</span>
          )}
        </div>
      </div>

      {/* Note text */}
      {props.noteText && (
        <p className="text-xs text-muted-foreground mt-2">
          หมายเหตุ: {props.noteText}
        </p>
      )}
    </div>
  );
}
