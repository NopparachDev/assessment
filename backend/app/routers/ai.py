import base64
import json
import re

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import settings

router = APIRouter(prefix="/api/ai", tags=["ai"])

SYSTEM_PROMPT = """You are a hospital form analyzer. You receive an image of a paper-based assessment form used in hospitals.

Analyze the form and generate a JSON array of widgets that recreate this form digitally.

Available widget types and when to use them:
- "Label": For titles, section headers, static text. Props: label, text, variant ("h1"|"h2"|"h3"|"body")
- "TextInput": For text fields, name fields, free-text answers. Props: label, placeholder
- "NumberInput": For number fields, age, scores. Props: label, min, max
- "Checkbox": For single yes/no checkboxes. Props: label, text
- "CheckboxGroup": For multiple checkboxes (select many). Props: label, options[{label, value}]
- "RadioGroup": For single-select options. Props: label, options[{label, value}]
- "Dropdown": For dropdown selections. Props: label, options[{label, value}]
- "DatePicker": For date fields. Props: label
- "PatientInfo": For patient header section (name, HN, age, date). Props: label, showBorder, patientFields[{id, label, type, width}]
- "ScoringTable": For assessment tables with questions and score columns. Props: label, tableTitle, tableDescription, columns[{header, subHeader?, score}], scoringRows[{id, question}]
- "ScoreSummary": For score interpretation. Props: label, scoreRanges[{min, max, label, color}], noteText

Output a JSON array of widget objects. Each widget has:
{
  "type": "WidgetType",
  "x": number (horizontal position in pixels, canvas is 794px wide),
  "y": number (vertical position in pixels),
  "w": number (width in pixels),
  "h": number (height in pixels),
  "props": { ... widget-specific properties }
}

Rules:
1. Analyze the form layout carefully - preserve the visual structure
2. Position widgets to match the original form layout (x, y coordinates)
3. Use PatientInfo for patient header sections
4. Use ScoringTable for any table with questions and score columns
5. Use ScoreSummary for score interpretation sections
6. Use Label for section titles and headers
7. Use Checkbox for individual checkboxes
8. Use CheckboxGroup when multiple related checkboxes are grouped together
9. Set appropriate sizes (w, h) for each widget
10. Canvas is A4 size: 794px wide, 1123px tall. Place widgets within these bounds.
11. All text should be in Thai as shown in the form
12. Return ONLY the JSON array, no explanation"""


@router.post("/generate-form")
async def generate_form(file: UploadFile = File(...)):
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported (JPG, PNG)")

    image_data = await file.read()
    if len(image_data) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 20MB)")

    base64_image = base64.b64encode(image_data).decode("utf-8")

    # Map content types
    media_type = content_type
    if media_type == "image/jpg":
        media_type = "image/jpeg"

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": base64_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": "วิเคราะห์แบบฟอร์มนี้และสร้าง widget layout เป็น JSON",
                        },
                    ],
                }
            ],
        )

        response_text = message.content[0].text

        # Extract JSON from response (handle markdown code blocks)
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", response_text)
        if json_match:
            json_str = json_match.group(1).strip()
        else:
            json_str = response_text.strip()

        widgets = json.loads(json_str)

        if not isinstance(widgets, list):
            raise ValueError("Expected a JSON array of widgets")

        return {"widgets": widgets}

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Claude API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
