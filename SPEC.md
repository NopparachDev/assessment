# SPEC: Assessment Form Builder for HOSxP

## 1. Background & Problem Statement

โรงพยาบาลมีแบบฟอร์มประเมินคนไข้จำนวนมาก (เช่น แบบประเมินความเจ็บปวด, ความเสี่ยงการพลัดตก, ภาวะซึมเศร้า ฯลฯ) ซึ่งแพทย์และพยาบาลต้องกรอกในระหว่างการดูแลผู้ป่วย

**ปัญหาของระบบเดิม (LMD Form / Delphi):**
- รองรับเฉพาะ Windows Application เท่านั้น
- ต้องใช้ทักษะการเขียน Delphi จึงจะสร้างฟอร์มได้
- ไม่รองรับการใช้งานบน Tablet, Mobile, หรือ Browser
- กระบวนการอัปโหลดฟอร์มใหม่ซับซ้อนและใช้เวลานาน

---

## 2. Vision

> **"ให้บุคลากรโรงพยาบาลสามารถสร้าง แก้ไข และใช้งานแบบฟอร์มประเมินได้ด้วยตัวเอง บนทุกอุปกรณ์ โดยไม่ต้องเขียนโค้ด"**

---

## 3. Target Users

| Role | การใช้งานหลัก |
|------|---------------|
| IT / Admin โรงพยาบาล | สร้างและจัดการแบบฟอร์ม, อัปโหลดรูปฟอร์มเพื่อให้ AI แปลง |
| แพทย์ / พยาบาล | กรอกแบบฟอร์มประเมินคนไข้ |
| หัวหน้าแผนก | ดูรายงานสรุปผลการประเมิน |

---

## 4. Core Features

### 4.1 Drag & Drop Form Builder
- ลาก Widget/Component ลงพื้นที่สร้างฟอร์มได้ทันที
- Resize Component ได้โดยการลากขอบ
- รองรับ Component ต่อไปนี้:
  - `TextInput` — ช่องกรอกข้อความ
  - `NumberInput` — ช่องกรอกตัวเลข
  - `Dropdown` — รายการตัวเลือก
  - `RadioGroup` — เลือกได้ 1 ข้อ
  - `CheckboxGroup` — เลือกได้หลายข้อ
  - `ScoreSlider` — แถบคะแนน (เช่น 0–10)
  - `DatePicker` — เลือกวันที่
  - `Label` — ข้อความ/หัวข้อ
  - `Divider` — เส้นแบ่งส่วน
  - `Table` — ตารางกรอกข้อมูล
  - `Signature` — ช่องลายเซ็น
- ตั้งค่า Properties ของแต่ละ Widget ได้ (label, placeholder, required, scoring)
- AI Assistant ช่วยแนะนำ layout และ widget ที่เหมาะสม

### 4.2 AI Form Generator (Upload Image → Auto Build)
- อัปโหลดรูปภาพแบบฟอร์มกระดาษ (JPG/PNG/PDF)
- ระบบวิเคราะห์รูปด้วย AI แล้วสร้าง Widget layout ให้อัตโนมัติ
- ผู้ใช้สามารถแก้ไข/ปรับ layout ที่ได้รับมาก่อน Save

### 4.3 Responsive Form Rendering
- ฟอร์มที่สร้างต้องแสดงผลถูกต้องบน:
  - Desktop Browser (Chrome, Firefox, Edge)
  - Tablet (iPad, Android Tablet)
  - Mobile (iOS, Android)
- ระบบ Grid Layout ปรับจำนวนคอลัมน์อัตโนมัติตามขนาดหน้าจอ

### 4.4 Form Management (CRUD + Import/Export)
- สร้าง / แก้ไข / ลบ / Clone แบบฟอร์ม
- Versioning: เก็บ history การแก้ไขฟอร์ม
- Export เป็น JSON schema (สำหรับ Import ในระบบอื่น หรือ backup)
- Import จาก JSON schema
- Tag / Category จัดกลุ่มฟอร์มตามแผนก

### 4.5 Print / PDF Export
- Preview ฟอร์มแบบ Print Layout ก่อนพิมพ์จริง
- Print ออกมาตรง 1:1 กับที่เห็นบนหน้าจอ
- Export เป็น PDF ได้
- รองรับ Header/Footer ที่กำหนดเองได้ (ชื่อโรงพยาบาล, โลโก้, วันที่)

---

## 5. Technical Stack (Recommended)

| Layer | Technology | เหตุผล |
|-------|-----------|--------|
| Frontend | **Next.js 14** (App Router) | SSR, SEO, ecosystem ดี |
| UI Components | **Tailwind CSS + shadcn/ui** | Responsive, customizable |
| Form Builder | **react-dnd** หรือ **dnd-kit** | Drag & Drop ที่ mature |
| Backend | **FastAPI (Python)** | สอดคล้องกับ stack ที่มีอยู่ |
| Database | **PostgreSQL** | JSON column สำหรับ form schema |
| AI (Image→Form) | **Claude API** (vision) | แปลงรูปฟอร์มเป็น schema |
| Auth | **JWT** | integrate กับ HOSxP User |
| Print/PDF | **react-to-print + puppeteer** | WYSIWYG print |

---

## 6. Data Model (Form Schema)

```json
{
  "form_id": "uuid",
  "title": "แบบประเมินความเจ็บปวด NRS",
  "department": "อายุรกรรม",
  "version": 2,
  "created_by": "user_id",
  "created_at": "ISO8601",
  "updated_at": "ISO8601",
  "layout": {
    "columns": 12,
    "rows": [
      {
        "id": "row_1",
        "widgets": [
          {
            "id": "widget_uuid",
            "type": "ScoreSlider",
            "col_start": 1,
            "col_span": 12,
            "props": {
              "label": "ระดับความเจ็บปวด",
              "min": 0,
              "max": 10,
              "required": true,
              "scoring_weight": 1
            }
          }
        ]
      }
    ]
  }
}
```

---

## 7. API Endpoints

```
POST   /api/forms              — สร้างฟอร์มใหม่
GET    /api/forms              — ดูรายการฟอร์มทั้งหมด
GET    /api/forms/:id          — ดูฟอร์มตาม ID
PUT    /api/forms/:id          — แก้ไขฟอร์ม
DELETE /api/forms/:id          — ลบฟอร์ม
POST   /api/forms/:id/clone    — Clone ฟอร์ม
GET    /api/forms/:id/export   — Export JSON schema
POST   /api/forms/import       — Import JSON schema

POST   /api/ai/generate-form   — รับรูปภาพ → คืน form schema
POST   /api/ai/suggest-widgets — ถามคำแนะนำ widget จาก prompt
```

---

## 8. UI/UX Requirements

- **Form Builder** มีสามส่วนหลัก:
  - **Widget Panel** (ซ้าย) — รายการ component ที่ลากได้
  - **Canvas** (กลาง) — พื้นที่วาง widget
  - **Properties Panel** (ขวา) — ตั้งค่า widget ที่เลือก
- **AI Chat Bubble** — ลอยอยู่มุมขวาล่าง พิมพ์ถามได้เลย เช่น "ช่วยเพิ่ม section คะแนน"
- **Toolbar** — Undo/Redo, Preview, Save, Export, Print

---

## 9. HOSxP Integration

- Auth: ใช้ HOSxP Session Token หรือ SSO
- ดึงข้อมูลคนไข้ (HN, ชื่อ, อายุ) จาก HOSxP API มาแสดงใน Header ฟอร์ม
- บันทึกผลการกรอกฟอร์มกลับไปยัง HOSxP ผ่าน HOSxP REST API
- รองรับ HOSxP ทั้ง On-premise และ Cloud

---

## 10. Non-Functional Requirements

| ด้าน | เป้าหมาย |
|------|---------|
| Performance | Load form builder < 2s บน 4G |
| Compatibility | Chrome 90+, Safari 14+, Edge 90+ |
| Security | HTTPS only, input sanitization, role-based access |
| Accessibility | รองรับ keyboard navigation, contrast ratio ≥ 4.5:1 |
| Offline | Form กรอกได้แม้ไม่มีอินเตอร์เน็ต (sync เมื่อมีสัญญาณ) |

---

## 11. Out of Scope (v1)

- ระบบ Workflow / Approval
- Real-time Collaboration (หลายคนแก้ฟอร์มพร้อมกัน)
- Custom Scoring Formula ซับซ้อน
- Mobile Native App (iOS/Android) — ใช้ PWA แทน

---

## 12. Development Phases

### Phase 1 — Form Builder Core (4 สัปดาห์)
- [ ] Drag & Drop Canvas
- [ ] Widget library (8 types)
- [ ] Properties Panel
- [ ] Save/Load form schema

### Phase 2 — AI Integration (2 สัปดาห์)
- [ ] Upload image → AI generate form
- [ ] AI chat assistant ใน builder

### Phase 3 — Responsive + Print (2 สัปดาห์)
- [ ] Responsive renderer
- [ ] Print/PDF export

### Phase 4 — HOSxP Integration (2 สัปดาห์)
- [ ] Auth integration
- [ ] Patient data fetch
- [ ] Save result to HOSxP

---

## 13. Success Metrics

- IT สามารถสร้างฟอร์มใหม่ได้ใน **< 30 นาที** (เทียบกับ 1-2 วันในระบบเดิม)
- บุคลากรกรอกฟอร์มผ่าน Tablet ได้โดยไม่มีปัญหา UI
- ฟอร์มที่ Print ออกมาตรงกับ Preview 100%
- AI แปลงรูปฟอร์มเป็น digital form ได้ accuracy ≥ 80%

---

*ไฟล์นี้ใช้เป็น input สำหรับ Claude Code — วาง SPEC.md นี้ไว้ที่ root project แล้วสั่ง Claude Code ให้อ่านก่อนเริ่มพัฒนา*
