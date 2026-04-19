import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { FormSchema, Row, Widget, WidgetType, WidgetProps } from "./types";
import { WIDGET_DEFAULTS as defaults } from "./types";

interface HistoryEntry {
  layout: FormSchema["layout"];
}

interface FormBuilderState {
  form: FormSchema;
  selectedWidgetId: string | null;
  previewMode: boolean;
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];

  // Actions
  setForm: (form: FormSchema) => void;
  setTitle: (title: string) => void;
  setDepartment: (department: string) => void;
  setTags: (tags: string[]) => void;
  selectWidget: (id: string | null) => void;
  togglePreview: () => void;

  // Widget operations
  addWidget: (type: WidgetType, rowIndex?: number) => void;
  removeWidget: (widgetId: string) => void;
  updateWidgetProps: (widgetId: string, props: Partial<WidgetProps>) => void;
  updateWidgetLayout: (widgetId: string, colSpan: number) => void;
  moveWidget: (activeId: string, overId: string) => void;

  // Row operations
  addRow: (index?: number) => void;
  removeRow: (rowId: string) => void;
  moveRow: (fromIndex: number, toIndex: number) => void;

  // History
  undo: () => void;
  redo: () => void;

  // Reset
  resetForm: () => void;
}

const createEmptyForm = (): FormSchema => ({
  title: "Untitled Form",
  department: "",
  version: 1,
  layout: { columns: 12, rows: [] },
});

function pushHistory(state: FormBuilderState): { undoStack: HistoryEntry[]; redoStack: HistoryEntry[] } {
  return {
    undoStack: [...state.undoStack.slice(-49), { layout: JSON.parse(JSON.stringify(state.form.layout)) }],
    redoStack: [],
  };
}

export const useFormStore = create<FormBuilderState>((set) => ({
  form: createEmptyForm(),
  selectedWidgetId: null,
  previewMode: false,
  undoStack: [],
  redoStack: [],

  setForm: (form) => set({ form, undoStack: [], redoStack: [], selectedWidgetId: null }),

  setTitle: (title) =>
    set((s) => ({ form: { ...s.form, title } })),

  setDepartment: (department) =>
    set((s) => ({ form: { ...s.form, department } })),

  setTags: (tags) =>
    set((s) => ({ form: { ...s.form, tags } })),

  selectWidget: (id) => set({ selectedWidgetId: id }),

  togglePreview: () => set((s) => ({ previewMode: !s.previewMode, selectedWidgetId: null })),

  addWidget: (type, rowIndex) =>
    set((s) => {
      const history = pushHistory(s);
      const widget: Widget = {
        id: uuidv4(),
        type,
        col_start: 1,
        col_span: 12,
        props: { ...defaults[type] } as WidgetProps,
      };

      const newRows = [...s.form.layout.rows];
      if (rowIndex !== undefined && rowIndex < newRows.length) {
        newRows[rowIndex] = {
          ...newRows[rowIndex],
          widgets: [...newRows[rowIndex].widgets, widget],
        };
      } else {
        newRows.push({ id: uuidv4(), widgets: [widget] });
      }

      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
        selectedWidgetId: widget.id,
      };
    }),

  removeWidget: (widgetId) =>
    set((s) => {
      const history = pushHistory(s);
      const newRows = s.form.layout.rows
        .map((row) => ({
          ...row,
          widgets: row.widgets.filter((w) => w.id !== widgetId),
        }))
        .filter((row) => row.widgets.length > 0);

      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
        selectedWidgetId: s.selectedWidgetId === widgetId ? null : s.selectedWidgetId,
      };
    }),

  updateWidgetProps: (widgetId, props) =>
    set((s) => {
      const history = pushHistory(s);
      const newRows = s.form.layout.rows.map((row) => ({
        ...row,
        widgets: row.widgets.map((w) =>
          w.id === widgetId ? { ...w, props: { ...w.props, ...props } } : w
        ),
      }));
      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
      };
    }),

  updateWidgetLayout: (widgetId, colSpan) =>
    set((s) => {
      const history = pushHistory(s);
      const newRows = s.form.layout.rows.map((row) => ({
        ...row,
        widgets: row.widgets.map((w) =>
          w.id === widgetId ? { ...w, col_span: colSpan } : w
        ),
      }));
      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
      };
    }),

  moveWidget: (activeId, overId) =>
    set((s) => {
      const history = pushHistory(s);
      const rows = s.form.layout.rows;

      let activeWidget: Widget | null = null;
      let activeRowIdx = -1;
      let activeWidgetIdx = -1;

      for (let ri = 0; ri < rows.length; ri++) {
        for (let wi = 0; wi < rows[ri].widgets.length; wi++) {
          if (rows[ri].widgets[wi].id === activeId) {
            activeWidget = rows[ri].widgets[wi];
            activeRowIdx = ri;
            activeWidgetIdx = wi;
          }
        }
      }

      if (!activeWidget) return s;

      // Find over position
      let overRowIdx = -1;
      let overWidgetIdx = -1;
      for (let ri = 0; ri < rows.length; ri++) {
        if (rows[ri].id === overId) {
          overRowIdx = ri;
          overWidgetIdx = rows[ri].widgets.length;
          break;
        }
        for (let wi = 0; wi < rows[ri].widgets.length; wi++) {
          if (rows[ri].widgets[wi].id === overId) {
            overRowIdx = ri;
            overWidgetIdx = wi;
            break;
          }
        }
        if (overRowIdx >= 0) break;
      }

      if (overRowIdx < 0) return s;

      const newRows = rows.map((r) => ({ ...r, widgets: [...r.widgets] }));

      // Remove from old position
      newRows[activeRowIdx].widgets.splice(activeWidgetIdx, 1);

      // Adjust index if same row and removing shifted it
      let insertIdx = overWidgetIdx;
      if (activeRowIdx === overRowIdx && activeWidgetIdx < overWidgetIdx) {
        insertIdx--;
      }

      // Insert at new position
      newRows[overRowIdx].widgets.splice(insertIdx, 0, activeWidget);

      // Remove empty rows
      const filteredRows = newRows.filter((r) => r.widgets.length > 0);

      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: filteredRows } },
      };
    }),

  addRow: (index) =>
    set((s) => {
      const history = pushHistory(s);
      const newRow: Row = { id: uuidv4(), widgets: [] };
      const newRows = [...s.form.layout.rows];
      if (index !== undefined) {
        newRows.splice(index, 0, newRow);
      } else {
        newRows.push(newRow);
      }
      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
      };
    }),

  removeRow: (rowId) =>
    set((s) => {
      const history = pushHistory(s);
      return {
        ...history,
        form: {
          ...s.form,
          layout: { ...s.form.layout, rows: s.form.layout.rows.filter((r) => r.id !== rowId) },
        },
      };
    }),

  moveRow: (fromIndex, toIndex) =>
    set((s) => {
      const history = pushHistory(s);
      const newRows = [...s.form.layout.rows];
      const [moved] = newRows.splice(fromIndex, 1);
      newRows.splice(toIndex, 0, moved);
      return {
        ...history,
        form: { ...s.form, layout: { ...s.form.layout, rows: newRows } },
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

  resetForm: () => set({ form: createEmptyForm(), undoStack: [], redoStack: [], selectedWidgetId: null }),
}));
