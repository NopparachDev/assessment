"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type FormListItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Copy } from "lucide-react";

export default function FormsPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadForms = async () => {
    try {
      const data = await api.listForms();
      setForms(data);
    } catch {
      // Backend might not be running — show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this form?")) return;
    await api.deleteForm(id);
    loadForms();
  };

  const handleClone = async (id: string) => {
    await api.cloneForm(id);
    loadForms();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Assessment Forms</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Create and manage assessment forms
            </p>
          </div>
          <Link href="/builder/new">
            <Button className="gap-1">
              <Plus className="h-4 w-4" /> New Form
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : forms.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No forms yet. Create your first form!</p>
            <Link href="/builder/new">
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Create Form
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {forms.map((form) => (
              <Card key={form.id} className="flex items-center justify-between p-4">
                <div>
                  <Link
                    href={`/builder/${form.id}`}
                    className="font-medium hover:underline"
                  >
                    {form.title}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {form.department && <span>{form.department} &middot; </span>}
                    v{form.version} &middot; Updated{" "}
                    {new Date(form.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/builder/${form.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Clone"
                    onClick={() => handleClone(form.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    title="Delete"
                    onClick={() => handleDelete(form.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
