"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type FormListItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  Search,
  FileText,
  ClipboardList,
  LayoutGrid,
  List,
} from "lucide-react";

export default function FormsPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const loadForms = async () => {
    try {
      const data = await api.listForms();
      setForms(data);
    } catch {
      // Backend might not be running
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`ลบแบบฟอร์ม "${title}" ?`)) return;
    try {
      await api.deleteForm(id);
      loadForms();
    } catch {
      // handle error
    }
  };

  const handleClone = async (id: string) => {
    try {
      await api.cloneForm(id);
      loadForms();
    } catch {
      // handle error
    }
  };

  const filtered = forms.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      (f.department || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2">
              <ClipboardList className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Assessment Form Builder</h1>
              <p className="text-sm text-muted-foreground">
                สร้างและจัดการแบบฟอร์มประเมินสำหรับโรงพยาบาล
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาแบบฟอร์ม..."
                className="pl-9 h-9"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Link href="/builder/new">
            <Button className="gap-1.5 h-9">
              <Plus className="h-4 w-4" /> สร้างแบบฟอร์มใหม่
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {!loading && forms.length > 0 && (
          <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
            <span>ทั้งหมด {forms.length} แบบฟอร์ม</span>
            {search && (
              <span>
                พบ {filtered.length} รายการ
              </span>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">
            <div className="animate-pulse space-y-3 max-w-md mx-auto">
              <div className="h-16 bg-gray-200 rounded-lg" />
              <div className="h-16 bg-gray-200 rounded-lg" />
              <div className="h-16 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ) : forms.length === 0 ? (
          /* Empty state */
          <Card className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold mb-1">ยังไม่มีแบบฟอร์ม</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              เริ่มสร้างแบบฟอร์มประเมินใหม่ ด้วยการลาก widget ลงบน canvas
            </p>
            <Link href="/builder/new">
              <Button size="lg" className="gap-1.5">
                <Plus className="h-4 w-4" /> สร้างแบบฟอร์มแรก
              </Button>
            </Link>
          </Card>
        ) : filtered.length === 0 ? (
          /* No search results */
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">ไม่พบแบบฟอร์มที่ค้นหา</p>
            <p className="text-sm mt-1">ลองค้นหาด้วยคำอื่น</p>
          </div>
        ) : viewMode === "list" ? (
          /* List view */
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_150px_80px_140px_120px] gap-4 px-4 py-2.5 bg-gray-50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>ชื่อแบบฟอร์ม</span>
              <span>แผนก</span>
              <span>Version</span>
              <span>แก้ไขล่าสุด</span>
              <span className="text-right">จัดการ</span>
            </div>

            {filtered.map((form, i) => (
              <div key={form.id}>
                <div className="grid grid-cols-[1fr_150px_80px_140px_120px] gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                  {/* Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="bg-blue-50 rounded p-1.5 shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <Link
                      href={`/builder/${form.id}`}
                      className="font-medium text-sm hover:text-blue-600 hover:underline truncate"
                    >
                      {form.title}
                    </Link>
                  </div>

                  {/* Department */}
                  <div>
                    {form.department ? (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {form.department}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Version */}
                  <span className="text-sm text-muted-foreground">v{form.version}</span>

                  {/* Updated */}
                  <span className="text-sm text-muted-foreground">
                    {new Date(form.updated_at).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-0.5">
                    <Link href={`/builder/${form.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="แก้ไข">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="คัดลอก"
                      onClick={() => handleClone(form.id)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      title="ลบ"
                      onClick={() => handleDelete(form.id, form.title)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {i < filtered.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        ) : (
          /* Grid view */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((form) => (
              <Card
                key={form.id}
                className="p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      title="คัดลอก"
                      onClick={() => handleClone(form.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      title="ลบ"
                      onClick={() => handleDelete(form.id, form.title)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Link href={`/builder/${form.id}`} className="block group/link">
                  <h3 className="font-semibold text-sm group-hover/link:text-blue-600 truncate">
                    {form.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    {form.department && (
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {form.department}
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground">v{form.version}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    แก้ไขล่าสุด{" "}
                    {new Date(form.updated_at).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </Link>

                <div className="mt-3 pt-3 border-t">
                  <Link href={`/builder/${form.id}`}>
                    <Button variant="outline" size="sm" className="w-full h-8 gap-1 text-xs">
                      <Pencil className="h-3 w-3" /> แก้ไขแบบฟอร์ม
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
