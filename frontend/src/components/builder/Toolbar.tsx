"use client";

import { useFormStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Undo2, Redo2, Eye, EyeOff, Save, Download } from "lucide-react";
// import { AiScanDialog } from "./AiScanDialog";

interface ToolbarProps {
  onSave?: () => void;
  onExport?: () => void;
  saving?: boolean;
}

export function Toolbar({ onSave, onExport, saving }: ToolbarProps) {
  const {
    form,
    setTitle,
    setDepartment,
    previewMode,
    togglePreview,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useFormStore();

  return (
    <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
      {/* Form metadata */}
      <Input
        value={form.title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-8 w-48 text-sm font-medium"
        placeholder="Form title"
      />
      <Input
        value={form.department}
        onChange={(e) => setDepartment(e.target.value)}
        className="h-8 w-36 text-sm"
        placeholder="Department"
      />

      <Separator orientation="vertical" className="h-6" />

      {/* Undo / Redo */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={undo}
        disabled={undoStack.length === 0}
        title="Undo"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={redo}
        disabled={redoStack.length === 0}
        title="Redo"
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Preview */}
      <Button
        variant={previewMode ? "secondary" : "ghost"}
        size="sm"
        className="h-8 gap-1"
        onClick={togglePreview}
      >
        {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {previewMode ? "Edit" : "Preview"}
      </Button>

      {/* AI Scan — disabled for now */}
      {/* <Separator orientation="vertical" className="h-6" /> */}
      {/* <AiScanDialog /> */}

      <div className="flex-1" />

      {/* Save / Export */}
      {onExport && (
        <Button variant="outline" size="sm" className="h-8 gap-1" onClick={onExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      )}
      {onSave && (
        <Button size="sm" className="h-8 gap-1" onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}
        </Button>
      )}
    </div>
  );
}
