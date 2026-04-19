"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { WidgetType } from "@/lib/types";
import {
  Type,
  Hash,
  ChevronDown,
  Circle,
  CheckSquare,
  SlidersHorizontal,
  Calendar,
  Tag,
} from "lucide-react";

const WIDGET_ITEMS: { type: WidgetType; label: string; icon: React.ReactNode }[] = [
  { type: "TextInput", label: "Text Input", icon: <Type className="h-4 w-4" /> },
  { type: "NumberInput", label: "Number Input", icon: <Hash className="h-4 w-4" /> },
  { type: "Dropdown", label: "Dropdown", icon: <ChevronDown className="h-4 w-4" /> },
  { type: "RadioGroup", label: "Radio Group", icon: <Circle className="h-4 w-4" /> },
  { type: "CheckboxGroup", label: "Checkbox Group", icon: <CheckSquare className="h-4 w-4" /> },
  { type: "ScoreSlider", label: "Score Slider", icon: <SlidersHorizontal className="h-4 w-4" /> },
  { type: "DatePicker", label: "Date Picker", icon: <Calendar className="h-4 w-4" /> },
  { type: "Label", label: "Label / Heading", icon: <Tag className="h-4 w-4" /> },
];

function DraggableWidget({ type, label, icon }: { type: WidgetType; label: string; icon: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type, fromPalette: true },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm cursor-grab",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        isDragging && "opacity-50"
      )}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

export function WidgetPalette() {
  return (
    <div className="w-56 shrink-0 border-r bg-muted/30 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Widgets
      </h2>
      <div className="space-y-1.5">
        {WIDGET_ITEMS.map((item) => (
          <DraggableWidget key={item.type} {...item} />
        ))}
      </div>
    </div>
  );
}
