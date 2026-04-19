import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.form import Form
from app.schemas.form import FormCreate, FormUpdate, FormResponse

router = APIRouter(prefix="/api/forms", tags=["forms"])


@router.post("", response_model=FormResponse, status_code=201)
async def create_form(data: FormCreate, db: AsyncSession = Depends(get_db)):
    form = Form(
        title=data.title,
        department=data.department,
        created_by=data.created_by,
        schema=data.schema_data,
        tags=data.tags,
    )
    db.add(form)
    await db.commit()
    await db.refresh(form)
    return form


@router.get("", response_model=list[FormResponse])
async def list_forms(
    department: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Form).order_by(Form.updated_at.desc())
    if department:
        query = query.where(Form.department == department)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{form_id}", response_model=FormResponse)
async def get_form(form_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    form = await db.get(Form, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


@router.put("/{form_id}", response_model=FormResponse)
async def update_form(
    form_id: uuid.UUID, data: FormUpdate, db: AsyncSession = Depends(get_db)
):
    form = await db.get(Form, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    update_data = data.model_dump(exclude_unset=True)
    if "schema_data" in update_data:
        update_data["schema"] = update_data.pop("schema_data")
    for key, value in update_data.items():
        setattr(form, key, value)

    form.version += 1
    await db.commit()
    await db.refresh(form)
    return form


@router.delete("/{form_id}", status_code=204)
async def delete_form(form_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    form = await db.get(Form, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    await db.delete(form)
    await db.commit()


@router.post("/{form_id}/clone", response_model=FormResponse, status_code=201)
async def clone_form(form_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    original = await db.get(Form, form_id)
    if not original:
        raise HTTPException(status_code=404, detail="Form not found")

    clone = Form(
        title=f"{original.title} (Copy)",
        department=original.department,
        created_by=original.created_by,
        schema=original.schema,
        tags=original.tags,
    )
    db.add(clone)
    await db.commit()
    await db.refresh(clone)
    return clone


@router.get("/{form_id}/export")
async def export_form(form_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    form = await db.get(Form, form_id)
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return {
        "title": form.title,
        "department": form.department,
        "schema": form.schema,
        "tags": form.tags,
        "version": form.version,
    }


@router.post("/import", response_model=FormResponse, status_code=201)
async def import_form(data: FormCreate, db: AsyncSession = Depends(get_db)):
    form = Form(
        title=data.title,
        department=data.department,
        created_by=data.created_by,
        schema=data.schema_data,
        tags=data.tags,
    )
    db.add(form)
    await db.commit()
    await db.refresh(form)
    return form
