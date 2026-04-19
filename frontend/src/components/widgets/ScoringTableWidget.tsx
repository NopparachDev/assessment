"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { WidgetProps } from "@/lib/types";

export function ScoringTableWidget({
  props,
  interactive,
}: {
  props: WidgetProps;
  interactive?: boolean;
}) {
  const columns = props.columns || [];
  const rows = props.scoringRows || [];
  const [selected, setSelected] = useState<Record<string, number>>({});

  const totalScore = Object.values(selected).reduce((sum, v) => sum + v, 0);

  const handleSelect = (rowId: string, score: number) => {
    if (!interactive) return;
    setSelected((prev) => ({ ...prev, [rowId]: score }));
  };

  return (
    <div className="space-y-2">
      {/* Table title */}
      {props.tableTitle && (
        <div className="text-center">
          <h3 className="inline-block border border-foreground/30 rounded px-4 py-1 font-semibold text-sm">
            {props.tableTitle}
          </h3>
        </div>
      )}
      {props.tableDescription && (
        <p className="text-xs text-muted-foreground font-medium">
          {props.tableDescription}
        </p>
      )}

      {/* Scoring table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-2 py-1.5 text-left font-semibold min-w-[200px]">
                คำถาม
              </th>
              {columns.map((col, ci) => (
                <th
                  key={ci}
                  className="border border-border px-2 py-1 text-center font-semibold min-w-[70px]"
                >
                  <div>{col.header}</div>
                  {col.subHeader && (
                    <div className="text-[10px] font-normal text-muted-foreground">
                      {col.subHeader}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.id} className={ri % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                <td className="border border-border px-2 py-1.5 text-left">
                  {ri + 1}. {row.question}
                </td>
                {columns.map((col, ci) => (
                  <td
                    key={ci}
                    className={cn(
                      "border border-border px-2 py-1.5 text-center cursor-pointer transition-colors",
                      interactive && "hover:bg-primary/10",
                      selected[row.id] === col.score &&
                        "bg-primary/20 font-bold"
                    )}
                    onClick={() => handleSelect(row.id, col.score)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {interactive && (
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                            selected[row.id] === col.score
                              ? "border-primary"
                              : "border-muted-foreground/40"
                          )}
                        >
                          {selected[row.id] === col.score && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </div>
                      )}
                      <span>{col.score}</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total score */}
      {interactive && (
        <div className="flex justify-end">
          <div className="border border-border rounded px-3 py-1.5 bg-muted/30 text-sm font-semibold">
            รวมคะแนน: <span className="text-primary text-base">{totalScore}</span>
          </div>
        </div>
      )}
    </div>
  );
}
