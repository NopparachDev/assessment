"use client";

import { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useFormStore } from "@/lib/store";
import { WidgetPalette } from "./WidgetPalette";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toolbar } from "./Toolbar";
import { WidgetRenderer } from "@/components/widgets/WidgetRenderer";
import { WIDGET_DEFAULTS } from "@/lib/types";
import type { WidgetType, WidgetProps } from "@/lib/types";
import { api } from "@/lib/api";

interface FormBuilderProps {
  formId?: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const { form, addWidget, moveWidget, previewMode } = useFormStore();
  const [saving, setSaving] = useState(false);
  const [draggedType, setDraggedType] = useState<WidgetType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.fromPalette) {
      setDraggedType(active.data.current.type as WidgetType);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setDraggedType(null);

      if (!over) return;

      // Dragging from palette → canvas
      if (active.data.current?.fromPalette) {
        const widgetType = active.data.current.type as WidgetType;
        addWidget(widgetType);
        return;
      }

      // Reordering within canvas
      if (active.id !== over.id) {
        moveWidget(active.id as string, over.id as string);
      }
    },
    [addWidget, moveWidget]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const schemaData = {
        layout: form.layout,
      };

      if (formId) {
        await api.updateForm(formId, {
          title: form.title,
          department: form.department || undefined,
          schema: schemaData,
        });
      } else {
        const created = await api.createForm({
          title: form.title,
          department: form.department || undefined,
          schema: schemaData,
        });
        // Update URL without reload
        window.history.replaceState(null, "", `/builder/${created.id}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [form, formId]);

  const handleExport = useCallback(() => {
    const data = {
      title: form.title,
      department: form.department,
      version: form.version,
      layout: form.layout,
      tags: form.tags,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title || "form"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [form]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col">
        <Toolbar onSave={handleSave} onExport={handleExport} saving={saving} />
        <div className="flex flex-1 overflow-hidden">
          {!previewMode && <WidgetPalette />}
          <Canvas />
          {!previewMode && <PropertiesPanel />}
        </div>
      </div>

      {/* Drag overlay for palette items */}
      <DragOverlay>
        {draggedType && (
          <div className="rounded-md border bg-card p-3 shadow-lg opacity-80 w-64">
            <WidgetRenderer
              type={draggedType}
              props={WIDGET_DEFAULTS[draggedType] as WidgetProps}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
