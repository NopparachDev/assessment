"use client";

import { useCallback, useState, useEffect } from "react";
import { useFormStore } from "@/lib/store";
import { WidgetPalette } from "./WidgetPalette";
import { FreeformCanvas } from "./FreeformCanvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { Toolbar } from "./Toolbar";
import { api } from "@/lib/api";

interface FormBuilderProps {
  formId?: string;
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const { form, previewMode, removeWidget, selectedWidgetId } = useFormStore();
  const [saving, setSaving] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete when typing in inputs
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

        if (selectedWidgetId) {
          removeWidget(selectedWidgetId);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          useFormStore.getState().redo();
        } else {
          useFormStore.getState().undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWidgetId, removeWidget]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const schemaData = { layout: form.layout };

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
    <div className="flex h-screen flex-col">
      <Toolbar onSave={handleSave} onExport={handleExport} saving={saving} />
      <div className="flex flex-1 overflow-hidden">
        {!previewMode && <WidgetPalette />}
        <FreeformCanvas />
        {!previewMode && <PropertiesPanel />}
      </div>
    </div>
  );
}
