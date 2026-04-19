"use client";

import { cn } from "@/lib/utils";
import { useFormStore } from "@/lib/store";
import type { WidgetType } from "@/lib/types";
import {
  Type,
  Hash,
  ChevronDown,
  Circle,
  Square,
  CheckSquare,
  SlidersHorizontal,
  Calendar,
  Tag,
  Table2,
  User,
  BarChart3,
} from "lucide-react";

interface WidgetGroup {
  title: string;
  items: { type: WidgetType; label: string; icon: React.ReactNode }[];
}

const WIDGET_GROUPS: WidgetGroup[] = [
  {
    title: "Assessment",
    items: [
      { type: "ScoringTable", label: "Scoring Table", icon: <Table2 className="h-4 w-4" /> },
      { type: "PatientInfo", label: "Patient Info", icon: <User className="h-4 w-4" /> },
      { type: "ScoreSummary", label: "Score Summary", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: "Basic",
    items: [
      { type: "Label", label: "Label / Heading", icon: <Tag className="h-4 w-4" /> },
      { type: "TextInput", label: "Text Input", icon: <Type className="h-4 w-4" /> },
      { type: "NumberInput", label: "Number Input", icon: <Hash className="h-4 w-4" /> },
      { type: "Dropdown", label: "Dropdown", icon: <ChevronDown className="h-4 w-4" /> },
      { type: "RadioGroup", label: "Radio Group", icon: <Circle className="h-4 w-4" /> },
      { type: "Checkbox", label: "Checkbox", icon: <Square className="h-4 w-4" /> },
      { type: "CheckboxGroup", label: "Checkbox Group", icon: <CheckSquare className="h-4 w-4" /> },
      { type: "ScoreSlider", label: "Score Slider", icon: <SlidersHorizontal className="h-4 w-4" /> },
      { type: "DatePicker", label: "Date Picker", icon: <Calendar className="h-4 w-4" /> },
    ],
  },
];

function PaletteItem({
  type,
  label,
  icon,
}: {
  type: WidgetType;
  label: string;
  icon: React.ReactNode;
}) {
  const addWidget = useFormStore((s) => s.addWidget);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("widgetType", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  // Also support click-to-add
  const handleClick = () => {
    addWidget(type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm",
        "cursor-grab active:cursor-grabbing",
        "hover:bg-accent hover:text-accent-foreground transition-colors"
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
      <div className="space-y-4">
        {WIDGET_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              {group.title}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <PaletteItem key={item.type} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t text-[10px] text-muted-foreground space-y-0.5">
        <p>Drag onto canvas or click to add</p>
        <p>Ctrl+Scroll to zoom</p>
      </div>
    </div>
  );
}
