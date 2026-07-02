/**
 * autoDetect.js — Garment auto-detection via Gemini Flash Lite
 *
 * Builds a structured detection prompt and validates the response
 * against the app's existing enum values from constants.jsx.
 */

import {
  GARMENT_TYPES,
  FABRICS,
  FITS,
  MODEL_TYPES,
  HEADWEAR_OPTIONS,
  BRAND_STYLES,
} from './constants'

// ─── Detection Schema ──────────────────────────────────────────────────────────
// Each field maps to a constants.jsx enum. Only whitelisted values are accepted.

export const DETECTION_SCHEMA = {
  garmentType: {
    label: 'Garment Type',
    values: GARMENT_TYPES.map((g) => g.value),
    required: true,
    optionKey: 'garmentType',
  },
  fabric: {
    label: 'Fabric',
    values: FABRICS.filter((f) => f.value !== 'any').map((f) => f.value),
    required: false,
    optionKey: 'fabric',
    fallback: 'any',
  },
  fit: {
    label: 'Fit',
    values: FITS.map((f) => f.value),
    required: false,
    optionKey: 'fit',
    fallback: 'regular',
  },
  modelGender: {
    label: 'Model Gender',
    values: MODEL_TYPES.map((m) => m.value),
    required: false,
    optionKey: 'modelType',
    fallback: 'female',
  },
  headwear: {
    label: 'Headwear',
    values: HEADWEAR_OPTIONS.map((h) => h.value),
    required: false,
    optionKey: 'headwear',
    fallback: 'none',
  },
  brandStyle: {
    label: 'Brand Style',
    values: BRAND_STYLES.map((b) => b.value),
    required: false,
    optionKey: 'brandStyle',
    fallback: 'generic',
  },
}

// ─── Prompt Builder ─────────────────────────────────────────────────────────────

/**
 * Builds the structured JSON detection prompt for Flash Lite.
 * Asks for garment analysis and returns valid enum values.
 */
export function buildDetectionPrompt() {
  const fieldDescriptions = Object.entries(DETECTION_SCHEMA).map(
    ([key, schema]) =>
      `  "${key}": one of [${schema.values.map((v) => `"${v}"`).join(', ')}]`
  )

  return `You are a fashion garment analysis expert. Analyze the provided garment image and return a JSON object with the following fields:

{
${fieldDescriptions.join(',\n')}
}

Rules:
- Return ONLY a valid JSON object, no markdown, no explanation, no code blocks.
- Each value MUST be exactly one of the listed options for that field.
- For "garmentType": identify the primary garment visible in the image.
- For "fabric": identify the material (cotton, silk, denim, wool, linen, leather, activewear).
- For "fit": describe how the garment fits (regular, tight, oversized, cropped, longline).
- For "modelGender": if a person is wearing the garment, identify their apparent gender. If no person, use "female".
- For "headwear": identify if the person is wearing a hijab or no headwear. Default to "none".
- For "brandStyle": match the closest aesthetic. Default to "generic".
- If you cannot determine a field, omit it from the response.`
}

// ─── Response Schema (for Gemini structured output) ─────────────────────────────

/**
 * Returns the responseSchema object for Gemini's structured JSON output mode.
 */
export function getDetectionResponseSchema() {
  return {
    type: 'OBJECT',
    properties: {
      garmentType: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.garmentType.values,
      },
      fabric: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.fabric.values,
      },
      fit: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.fit.values,
      },
      modelGender: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.modelGender.values,
      },
      headwear: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.headwear.values,
      },
      brandStyle: {
        type: 'STRING',
        enum: DETECTION_SCHEMA.brandStyle.values,
      },
    },
    required: ['garmentType'],
  }
}

// ─── Response Parser ────────────────────────────────────────────────────────────

/**
 * Parses and validates the raw detection response against the schema.
 * Returns only fields with valid enum values. Invalid/unknown values are silently dropped.
 *
 * @param {string|object} raw - Raw JSON string or parsed object from Flash Lite
 * @returns {{ fields: Record<string, string>, count: number }} - Valid detected fields + count
 */
export function parseDetectionResult(raw) {
  let parsed = raw
  if (typeof raw === 'string') {
    // Strip markdown code blocks if the model wraps the response
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.warn('[autoDetect] Failed to parse detection response:', raw)
      return { fields: {}, count: 0 }
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return { fields: {}, count: 0 }
  }

  const fields = {}
  let count = 0

  for (const [key, schema] of Object.entries(DETECTION_SCHEMA)) {
    const value = parsed[key]
    if (value && schema.values.includes(value)) {
      fields[schema.optionKey] = value
      count++
    }
  }

  return { fields, count }
}
