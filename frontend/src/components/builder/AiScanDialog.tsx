"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFormStore } from "@/lib/store";
import { api } from "@/lib/api";
import type { Widget, WidgetType, WidgetProps } from "@/lib/types";
import { WIDGET_SIZE_DEFAULTS } from "@/lib/types";
import { ScanLine, Upload, Loader2, ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export function AiScanDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { form, setForm } = useFormStore();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped || !dropped.type.startsWith("image/")) return;
    setFile(dropped);
    setError(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(dropped);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const result = await api.generateFormFromImage(file);

      // Convert AI response widgets to typed widgets with IDs
      const widgets: Widget[] = result.widgets.map((raw: Record<string, unknown>) => {
        const type = (raw.type as WidgetType) || "Label";
        const defaultSize = WIDGET_SIZE_DEFAULTS[type] || { w: 200, h: 40 };

        return {
          id: uuidv4(),
          type,
          x: (raw.x as number) || 0,
          y: (raw.y as number) || 0,
          w: (raw.w as number) || defaultSize.w,
          h: (raw.h as number) || defaultSize.h,
          props: (raw.props as WidgetProps) || { label: type },
        };
      });

      // Set the form with generated widgets
      setForm({
        ...form,
        title: form.title === "Untitled Form" ? "AI Generated Form" : form.title,
        layout: {
          canvasWidth: 794,
          canvasHeight: Math.max(1123, ...widgets.map((w) => w.y + w.h + 40)),
          widgets,
        },
      });

      setOpen(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }, [file, form, setForm]);

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
      setFile(null);
      setPreview(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={() => setOpen(true)}
        >
          <ScanLine className="h-4 w-4" />
          AI Scan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5" />
            AI Form Scanner
          </DialogTitle>
          <DialogDescription>
            อัปโหลดรูปแบบฟอร์มกระดาษ แล้ว AI จะวิเคราะห์และสร้างฟอร์มดิจิทัลให้อัตโนมัติ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            {preview ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                  src={preview}
                  alt="Form preview"
                  className="max-h-64 mx-auto rounded shadow-sm"
                />
                <p className="text-sm text-gray-600">{file?.name}</p>
                <p className="text-xs text-gray-400">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-300" />
                <p className="font-medium">Drop image here or click to browse</p>
                <p className="text-xs text-gray-400">JPG, PNG (max 20MB)</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Error */}
          {error && (
            <div className="rounded bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Loading message */}
          {loading && (
            <div className="rounded bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              AI กำลังวิเคราะห์แบบฟอร์ม... อาจใช้เวลา 10-30 วินาที
            </div>
          )}

          {/* Generate button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!file || loading} className="gap-1.5">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Generate Form
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
