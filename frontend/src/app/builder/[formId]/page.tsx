"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FormBuilder } from "@/components/builder/FormBuilder";
import { useFormStore } from "@/lib/store";
import { api } from "@/lib/api";

export default function BuilderPage() {
  const params = useParams();
  const formId = params.formId as string;
  const isNew = formId === "new";
  const { setForm, resetForm } = useFormStore();
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      resetForm();
      return;
    }

    const loadForm = async () => {
      try {
        const data = await api.getForm(formId);
        const layout = (data.schema as { layout?: unknown })?.layout;
        setForm({
          form_id: data.id,
          title: data.title,
          department: data.department || "",
          version: data.version,
          created_by: data.created_by || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at,
          layout: layout as import("@/lib/types").FormLayout || { columns: 12, rows: [] },
          tags: data.tags || undefined,
        });
      } catch (err) {
        console.error("Failed to load form:", err);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId, isNew, setForm, resetForm]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  return <FormBuilder formId={isNew ? undefined : formId} />;
}
