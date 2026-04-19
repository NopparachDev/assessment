"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "@/lib/store";
import { CanvasWidget } from "./CanvasWidget";
import { cn } from "@/lib/utils";

export function Canvas() {
  const { form, selectWidget, previewMode } = useFormStore();
  const allWidgets = form.layout.rows.flatMap((row) => row.widgets);

  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });

  return (
    <div
      className="flex-1 overflow-y-auto bg-muted/10 p-6"
      onClick={() => selectWidget(null)}
    >
      <div className="mx-auto max-w-3xl">
        {/* Form title display */}
        {previewMode && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">{form.title || "Untitled Form"}</h1>
            {form.department && (
              <p className="text-muted-foreground mt-1">{form.department}</p>
            )}
          </div>
        )}

        <div
          ref={setNodeRef}
          className={cn(
            "min-h-[400px] rounded-lg border-2 border-dashed p-4 transition-colors",
            isOver ? "border-primary bg-primary/5" : "border-muted-foreground/20",
            allWidgets.length > 0 && "border-solid border-border"
          )}
        >
          {allWidgets.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium">Drag widgets here</p>
                <p className="text-sm mt-1">
                  Drag components from the left panel to start building your form
                </p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={allWidgets.map((w) => w.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {allWidgets.map((widget) => (
                  <CanvasWidget key={widget.id} widget={widget} />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
}
