import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { FormSchema, Widget, WidgetType, WidgetProps } from "./types";
import { WIDGET_DEFAULTS as defaults, WIDGET_SIZE_DEFAULTS as sizes } from "./types";

interface HistoryEntry {
  layout: FormSchema["layout"];
}

interface FormBuilderState {
  form: FormSchema;
  selectedWidgetId: string | null;
  previewMode: boolean;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  zoom: number;
  gridSnap: number;

  // Actions
  setForm: (form: FormSchema) => void;
  setTitle: (title: string) => void;
  setDepartment: (department: string) => void;
  setTags: (tags: string[]) => void;
  selectWidget: (id: string | null) => void;
  togglePreview: () => void;
  setZoom: (zoom: number) => void;
  setGridSnap: (snap: number) => void;

  // Widget operations
  addWidget: (type: WidgetType, x?: number, y?: number) => void;
  removeWidget: (widgetId: string) => void;
  updateWidgetProps: (widgetId: string, props: Partial<WidgetProps>) => void;
  moveWidget: (widgetId: string, x: number, y: number) => void;
  resizeWidget: (widgetId: string, w: number, h: number) => void;
  duplicateWidget: (widgetId: string) => void;

  // History
  undo: () => void;
  redo: () => void;

  // Canvas
  setCanvasSize: (width: number, height: number) => void;

  // Reset
  resetForm: () => void;
}

const CANVAS_WIDTH = 794; // A4 at 96 DPI
const CANVAS_HEIGHT = 1123;

const createEmptyForm = (): FormSchema => ({
  title: "Untitled Form",
  department: "",
  version: 1,
  layout: { canvasWidth: CANVAS_WIDTH, canvasHeight: CANVAS_HEIGHT, widgets: [] },
});

function pushHistory(state: FormBuilderState): { undoStack: HistoryEntry[]; redoStack: HistoryEntry[] } {
  return {
    undoStack: [...state.undoStack.slice(-49), { layout: JSON.parse(JSON.stringify(state.form.layout)) }],
    redoStack: [],
  };
}

function snapToGrid(value: number, grid: number): number {
  if (grid <= 1) return Math.round(value);
  return Math.round(value / grid) * grid;
}

export const useFormStore = create<FormBuilderState>((set) => ({
  form: createEmptyForm(),
  selectedWidgetId: null,
  previewMode: false,
  undoStack: [],
  redoStack: [],
  zoom: 1,
  gridSnap: 10,

  setForm: (form) => set({ form, undoStack: [], redoStack: [], selectedWidgetId: null }),

  setTitle: (title) =>
    set((s) => ({ form: { ...s.form, title } })),

  setDepartment: (department) =>
    set((s) => ({ form: { ...s.form, department } })),

  setTags: (tags) =>
    set((s) => ({ form: { ...s.form, tags } })),

  selectWidget: (id) => set({ selectedWidgetId: id }),

  togglePreview: () => set((s) => ({ previewMode: !s.previewMode, selectedWidgetId: null })),

  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),

  setGridSnap: (snap) => set({ gridSnap: snap }),

  addWidget: (type, x, y) =>
    set((s) => {
      const history = pushHistory(s);
      const size = sizes[type];
      const snap = s.gridSnap;

      // Find a good position — default to center-ish or provided coords
      const posX = x !== undefined ? snapToGrid(x, snap) : snapToGrid(40, snap);
      const posY = y !== undefined
        ? snapToGrid(y, snap)
        : snapToGrid(
            s.form.layout.widgets.length > 0
              ? Math.max(...s.form.layout.widgets.map((w) => w.y + w.h)) + 10
              : 40,
            snap
          );

      const widget: Widget = {
        id: uuidv4(),
        type,
        x: posX,
        y: posY,
        w: size.w,
        h: size.h,
        props: { ...defaults[type] } as WidgetProps,
      };

      return {
        ...history,
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: [...s.form.layout.widgets, widget],
          },
        },
        selectedWidgetId: widget.id,
      };
    }),

  removeWidget: (widgetId) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        ...history,
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: s.form.layout.widgets.filter((w) => w.id !== widgetId),
          },
        },
        selectedWidgetId: s.selectedWidgetId === widgetId ? null : s.selectedWidgetId,
      };
    }),

  updateWidgetProps: (widgetId, props) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        ...history,
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: s.form.layout.widgets.map((w) =>
              w.id === widgetId ? { ...w, props: { ...w.props, ...props } } : w
            ),
          },
        },
      };
    }),

  moveWidget: (widgetId, x, y) =>
    set((s) => {
      const snap = s.gridSnap;
      return {
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: s.form.layout.widgets.map((w) =>
              w.id === widgetId
                ? { ...w, x: snapToGrid(Math.max(0, x), snap), y: snapToGrid(Math.max(0, y), snap) }
                : w
            ),
          },
        },
      };
    }),

  resizeWidget: (widgetId, w, h) =>
    set((s) => {
      const snap = s.gridSnap;
      return {
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: s.form.layout.widgets.map((widget) =>
              widget.id === widgetId
                ? { ...widget, w: snapToGrid(Math.max(40, w), snap), h: snapToGrid(Math.max(20, h), snap) }
                : widget
            ),
          },
        },
      };
    }),

  duplicateWidget: (widgetId) =>
    set((s) => {
      const history = pushHistory(s);
      const original = s.form.layout.widgets.find((w) => w.id === widgetId);
      if (!original) return s;

      const clone: Widget = {
        ...JSON.parse(JSON.stringify(original)),
        id: uuidv4(),
        x: original.x + 20,
        y: original.y + 20,
      };

      return {
        ...history,
        form: {
          ...s.form,
          layout: {
            ...s.form.layout,
            widgets: [...s.form.layout.widgets, clone],
          },
        },
        selectedWidgetId: clone.id,
      };
    }),

  undo: () =>
    set((s) => {
      if (s.undoStack.length === 0) return s;
      const prev = s.undoStack[s.undoStack.length - 1];
      return {
        undoStack: s.undoStack.slice(0, -1),
        redoStack: [...s.redoStack, { layout: JSON.parse(JSON.stringify(s.form.layout)) }],
        form: { ...s.form, layout: prev.layout },
        selectedWidgetId: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.redoStack.length === 0) return s;
      const next = s.redoStack[s.redoStack.length - 1];
      return {
        redoStack: s.redoStack.slice(0, -1),
        undoStack: [...s.undoStack, { layout: JSON.parse(JSON.stringify(s.form.layout)) }],
        form: { ...s.form, layout: next.layout },
        selectedWidgetId: null,
      };
    }),

  setCanvasSize: (width, height) =>
    set((s) => ({
      form: {
        ...s.form,
        layout: { ...s.form.layout, canvasWidth: width, canvasHeight: height },
      },
    })),

  resetForm: () => set({ form: createEmptyForm(), undoStack: [], redoStack: [], selectedWidgetId: null }),
}));
