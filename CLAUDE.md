# Assessment Form Builder

## Project Overview
Hospital assessment form builder for HOSxP. Replaces legacy Delphi-based LMD forms with a web-based drag-and-drop builder.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, dnd-kit, Zustand
- **Backend**: FastAPI (Python), SQLAlchemy (async), PostgreSQL, Alembic
- **Dev**: Docker Compose for Postgres

## Project Structure
```
frontend/     — Next.js 14 app
backend/      — FastAPI app
  app/
    main.py       — FastAPI entry point
    config.py     — Settings via pydantic-settings
    database.py   — SQLAlchemy async engine & session
    models/       — SQLAlchemy ORM models
    schemas/      — Pydantic request/response schemas
    routers/      — API route handlers
  alembic/        — Database migrations
```

## Commands
- Frontend dev: `cd frontend && npm run dev`
- Backend dev: `cd backend && uvicorn app.main:app --reload`
- Database: `docker compose up db -d`
- Alembic migration: `cd backend && alembic revision --autogenerate -m "msg"` then `alembic upgrade head`

## Conventions
- Form schemas are stored as JSONB in PostgreSQL
- Widget types: TextInput, NumberInput, Dropdown, RadioGroup, CheckboxGroup, ScoreSlider, DatePicker, Label
- 12-column grid layout system
- All API routes prefixed with `/api/`
- Frontend state managed with Zustand
- Use `async/await` throughout the backend
