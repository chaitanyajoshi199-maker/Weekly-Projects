if defect=null pass either fail
width+default determines the servirity of the default


How backend decides these fields
Severity → comes from a severity matrix.
Example:

Small scratch → "Low"

Medium dent → "Medium"

Large crack → "High"  
Backend maps defect size/type to severity levels.

Confidence → is the raw score from the ML model (e.g., 0.31 → 31%).
This is directly sent by the backend.

Status (PASS/FAIL) → backend compares confidence against a threshold.
Example:

Threshold = 70%

Confidence = 31%
→ Since confidence < threshold, backend sets "status": "FAIL".



function getSeverity(type: string, size: {width: number, height: number}) {
  if (type === "Scratch" && size.width < 20) return "Low";
  if (type === "Dent" && size.width < 50) return "Medium";
  if (type === "Crack" && size.width > 50) return "High";
  return "Unknown";
}
