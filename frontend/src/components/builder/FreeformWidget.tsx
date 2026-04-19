"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/lib/store";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import type { Widget } from "@/lib/types";
import { GripVertical, Trash2, Copy } from "lucide-react";

interface FreeformWidgetProps {
  widget: Widget;
  zoom: number;
}

const RESIZE_HANDLES = ["se", "sw", "ne", "nw", "e", "w", "s", "n"] as const;
type ResizeDir = (typeof RESIZE_HANDLES)[number];

const handleCursors: Record<ResizeDir, string> = {
  se: "cursor-se-resize",
  sw: "cursor-sw-resize",
  ne: "cursor-ne-resize",
  nw: "cursor-nw-resize",
  e: "cursor-e-resize",
  w: "cursor-w-resize",
  s: "cursor-s-resize",
  n: "cursor-n-resize",
};

const handlePositions: Record<ResizeDir, string> = {
  nw: "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  ne: "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  se: "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  n: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  e: "top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
  w: "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
};

export function FreeformWidget({ widget, zoom }: FreeformWidgetProps) {
  const {
    selectedWidgetId,
    selectWidget,
    moveWidget,
    resizeWidget,
    removeWidget,
    duplicateWidget,
    previewMode,
  } = useFormStore();

  const isSelected = selectedWidgetId === widget.id;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Drag to move
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (previewMode) return;
      e.stopPropagation();
      selectWidget(widget.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = widget.x;
      const origY = widget.y;
      setIsDragging(true);

      const onMouseMove = (ev: MouseEvent) => {
        const dx = (ev.clientX - startX) / zoom;
        const dy = (ev.clientY - startY) / zoom;
        moveWidget(widget.id, origX + dx, origY + dy);
      };
      const onMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [widget.id, widget.x, widget.y, zoom, moveWidget, selectWidget, previewMode]
  );

  // Resize
  const handleResize = useCallback(
    (dir: ResizeDir, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const origW = widget.w;
      const origH = widget.h;
      const origX = widget.x;
      const origY = widget.y;
      setIsResizing(true);

      const onMouseMove = (ev: MouseEvent) => {
        const dx = (ev.clientX - startX) / zoom;
        const dy = (ev.clientY - startY) / zoom;

        let newW = origW;
        let newH = origH;
        let newX = origX;
        let newY = origY;

        if (dir.includes("e")) newW = origW + dx;
        if (dir.includes("w")) { newW = origW - dx; newX = origX + dx; }
        if (dir.includes("s")) newH = origH + dy;
        if (dir.includes("n")) { newH = origH - dy; newY = origY + dy; }

        newW = Math.max(40, newW);
        newH = Math.max(20, newH);

        resizeWidget(widget.id, newW, newH);
        if (dir.includes("w") || dir.includes("n")) {
          moveWidget(widget.id, newX, newY);
        }
      };

      const onMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [widget, zoom, resizeWidget, moveWidget]
  );

  if (previewMode) {
    return (
      <div
        style={{
          position: "absolute",
          left: widget.x,
          top: widget.y,
          width: widget.w,
          minHeight: widget.h,
        }}
      >
        <WidgetRenderer type={widget.type} props={widget.props} interactive />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: widget.x,
        top: widget.y,
        width: widget.w,
        minHeight: widget.h,
      }}
      className={cn(
        "group",
        isDragging && "opacity-70",
        isResizing && "opacity-90"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectWidget(widget.id);
      }}
    >
      {/* Widget border */}
      <div
        className={cn(
          "relative rounded border p-2 transition-all h-full",
          isSelected
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white"
            : "border-gray-200 hover:border-blue-300 bg-white"
        )}
      >
        {/* Drag handle bar */}
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            "absolute -top-5 left-0 right-0 h-5 flex items-center justify-center gap-1 rounded-t text-[10px] font-medium transition-opacity cursor-move",
            isSelected
              ? "bg-blue-500 text-white opacity-100"
              : "bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100"
          )}
        >
          <GripVertical className="h-3 w-3" />
          <span>{widget.type}</span>

          {/* Quick actions */}
          <div className="absolute right-1 flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateWidget(widget.id);
              }}
              className="p-0.5 rounded hover:bg-white/20"
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWidget(widget.id);
              }}
              className="p-0.5 rounded hover:bg-red-400/50"
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Widget content */}
        <div className="pointer-events-none select-none overflow-hidden">
          <WidgetRenderer type={widget.type} props={widget.props} />
        </div>
      </div>

      {/* Resize handles */}
      {isSelected &&
        RESIZE_HANDLES.map((dir) => (
          <div
            key={dir}
            onMouseDown={(e) => handleResize(dir, e)}
            className={cn(
              "absolute z-10 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white shadow",
              handlePositions[dir],
              handleCursors[dir]
            )}
          />
        ))}

      {/* Size indicator */}
      {isSelected && (isResizing || isDragging) && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-1.5 py-0.5 rounded whitespace-nowrap">
          {Math.round(widget.w)} × {Math.round(widget.h)} @ ({Math.round(widget.x)}, {Math.round(widget.y)})
        </div>
      )}
    </div>
  );
}
