"use client";

import { useRef, useCallback } from "react";
import { useFormStore } from "@/lib/store";
import { FreeformWidget } from "./FreeformWidget";
import { WIDGET_SIZE_DEFAULTS } from "@/lib/types";
import type { WidgetType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FreeformCanvas() {
  const { form, selectWidget, previewMode, addWidget, zoom, setZoom, gridSnap } = useFormStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  const widgets = form.layout.widgets;
  const canvasW = form.layout.canvasWidth;
  const canvasH = form.layout.canvasHeight;

  // Handle drop from palette
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const widgetType = e.dataTransfer.getData("widgetType") as WidgetType;
      if (!widgetType) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const size = WIDGET_SIZE_DEFAULTS[widgetType];
      const x = (e.clientX - rect.left) / zoom - size.w / 2;
      const y = (e.clientY - rect.top) / zoom - size.h / 2;

      addWidget(widgetType, Math.max(0, x), Math.max(0, y));
    },
    [addWidget, zoom]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  // Zoom with Ctrl+Wheel
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(zoom + delta);
      }
    },
    [zoom, setZoom]
  );

  return (
    <div
      className="flex-1 overflow-auto bg-gray-100"
      onWheel={handleWheel}
    >
      {/* Zoom indicator */}
      <div className="sticky top-2 left-2 z-20 inline-flex items-center gap-1 bg-white/90 backdrop-blur rounded shadow px-2 py-1 text-xs text-gray-600 ml-2 mt-2">
        <button onClick={() => setZoom(zoom - 0.1)} className="px-1 hover:text-black">−</button>
        <span className="tabular-nums w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} className="px-1 hover:text-black">+</button>
        <button onClick={() => setZoom(1)} className="px-1 ml-1 hover:text-black text-[10px]">Reset</button>
      </div>

      {/* Canvas area */}
      <div className="flex justify-center py-6 px-4">
        <div
          ref={canvasRef}
          style={{
            width: canvasW * zoom,
            height: canvasH * zoom,
            position: "relative",
          }}
          className={cn(
            "bg-white shadow-lg border border-gray-300",
            previewMode && "shadow-none"
          )}
          onClick={() => selectWidget(null)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Grid lines */}
          {!previewMode && gridSnap >= 10 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ opacity: 0.08 }}
            >
              <defs>
                <pattern
                  id="grid"
                  width={gridSnap * zoom}
                  height={gridSnap * zoom}
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d={`M ${gridSnap * zoom} 0 L 0 0 0 ${gridSnap * zoom}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          )}

          {/* Scaled content */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: canvasW,
              height: canvasH,
              position: "relative",
            }}
          >
            {/* Empty state */}
            {widgets.length === 0 && !previewMode && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                <div className="text-center">
                  <p className="text-lg font-medium">Drag widgets here</p>
                  <p className="text-sm mt-1">
                    Drop components from the left panel onto the canvas
                  </p>
                </div>
              </div>
            )}

            {/* Preview title */}
            {previewMode && (
              <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                <h1 className="text-xl font-bold">{form.title || "Untitled Form"}</h1>
                {form.department && (
                  <p className="text-gray-500 text-sm mt-0.5">{form.department}</p>
                )}
              </div>
            )}

            {/* Widgets */}
            {widgets.map((widget) => (
              <FreeformWidget
                key={widget.id}
                widget={widget}
                zoom={zoom}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
