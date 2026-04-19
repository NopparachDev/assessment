const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface FormListItem {
  id: string;
  title: string;
  department: string | null;
  version: number;
  updated_at: string;
}

export interface FormData {
  id: string;
  title: string;
  department: string | null;
  version: number;
  created_by: string | null;
  schema: Record<string, unknown>;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export const api = {
  listForms: () => request<FormListItem[]>("/api/forms"),
  getForm: (id: string) => request<FormData>(`/api/forms/${id}`),
  createForm: (data: { title: string; department?: string; schema: Record<string, unknown> }) =>
    request<FormData>("/api/forms", { method: "POST", body: JSON.stringify(data) }),
  updateForm: (id: string, data: { title?: string; department?: string; schema?: Record<string, unknown> }) =>
    request<FormData>(`/api/forms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteForm: (id: string) => request<void>(`/api/forms/${id}`, { method: "DELETE" }),
  cloneForm: (id: string) => request<FormData>(`/api/forms/${id}/clone`, { method: "POST" }),
  exportForm: (id: string) => request<Record<string, unknown>>(`/api/forms/${id}/export`),
  importForm: (data: { title: string; department?: string; schema: Record<string, unknown> }) =>
    request<FormData>("/api/forms/import", { method: "POST", body: JSON.stringify(data) }),
};
