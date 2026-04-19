"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useFormStore } from "@/lib/store";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import type { Widget } from "@/lib/types";
import { GripVertical, Trash2 } from "lucide-react";

export function CanvasWidget({ widget }: { widget: Widget }) {
  const { selectedWidgetId, selectWidget, removeWidget, previewMode } = useFormStore();
  const isSelected = selectedWidgetId === widget.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    data: { type: widget.type, widget },
    disabled: previewMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (previewMode) {
    return (
      <div className="p-3">
        <WidgetRenderer type={widget.type} props={widget.props} interactive />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-md border p-3 transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary/5"
          : "border-border hover:border-primary/50 bg-card",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectWidget(widget.id);
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeWidget(widget.id);
        }}
        className="absolute right-1 top-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Widget type badge */}
      <div className="absolute right-1 bottom-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {widget.type}
      </div>

      <div className="pl-5">
        <WidgetRenderer type={widget.type} props={widget.props} />
      </div>
    </div>
  );
}
