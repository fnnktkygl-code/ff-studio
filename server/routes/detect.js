import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'

const router = Router()

// ─── Detection Schema (mirrors client-side autoDetect.js) ────────────────────
const GARMENT_TYPES = [
  'shirt','tshirt','polo','blouse','tanktop','croptop',
  'pants','jeans','chinos','shorts','skirt','miniskirt',
  'dress','eveningdress','maxidress','jumpsuit',
  'jacket','doudoune','blazer','hoodie','sweater','cardigan','raincoat',
  'guandura','abaya','kaftan','djellaba',
  'shoes','heels','boots','sandals','loafers',
  'bag','cap','belt','scarf',
]

const FABRICS = ['cotton','silk','denim','wool','linen','leather','activewear']
const FITS = ['regular','tight','oversized','cropped','longline']
const GENDERS = ['female','male']
const HEADWEAR = ['none','hijab']
const BRANDS = ['generic','zara','ralph-lauren','hm','nike','asos','gucci']

const DETECTION_PROMPT = `You are a fashion garment analysis expert. Analyze the provided garment image and return a JSON object with the following fields:

{
  "garmentType": one of [${GARMENT_TYPES.map(v => `"${v}"`).join(', ')}],
  "fabric": one of [${FABRICS.map(v => `"${v}"`).join(', ')}],
  "fit": one of [${FITS.map(v => `"${v}"`).join(', ')}],
  "modelGender": one of [${GENDERS.map(v => `"${v}"`).join(', ')}],
  "headwear": one of [${HEADWEAR.map(v => `"${v}"`).join(', ')}],
  "brandStyle": one of [${BRANDS.map(v => `"${v}"`).join(', ')}]
}

Rules:
- Return ONLY a valid JSON object.
- Each value MUST be exactly one of the listed options.
- For "garmentType": identify the primary garment visible.
- For "fabric": identify the material.
- For "fit": describe how the garment fits.
- For "modelGender": if a person is wearing the garment, identify gender. If no person, use "female".
- For "headwear": identify hijab or none. Default "none".
- For "brandStyle": match closest aesthetic. Default "generic".
- If you cannot determine a field, omit it.`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    garmentType: { type: 'STRING', enum: GARMENT_TYPES },
    fabric: { type: 'STRING', enum: FABRICS },
    fit: { type: 'STRING', enum: FITS },
    modelGender: { type: 'STRING', enum: GENDERS },
    headwear: { type: 'STRING', enum: HEADWEAR },
    brandStyle: { type: 'STRING', enum: BRANDS },
  },
  required: ['garmentType'],
}

// Field key mapping (detection key → store option key)
const FIELD_MAP = {
  garmentType: 'garmentType',
  fabric: 'fabric',
  fit: 'fit',
  modelGender: 'modelType',
  headwear: 'headwear',
  brandStyle: 'brandStyle',
}

const VALID_VALUES = {
  garmentType: new Set(GARMENT_TYPES),
  fabric: new Set(FABRICS),
  fit: new Set(FITS),
  modelGender: new Set(GENDERS),
  headwear: new Set(HEADWEAR),
  brandStyle: new Set(BRANDS),
}

/**
 * POST /api/detect
 * Body: { imageBase64: "data:image/...;base64,..." }
 * Response: { detected: { garmentType, fabric, ... } } or { detected: null, error: "..." }
 */
router.post('/detect', async (req, res) => {
  const startTime = Date.now()

  try {
    const { imageBase64 } = req.body
    if (!imageBase64) {
      return res.status(400).json({ detected: null, error: 'Missing imageBase64' })
    }

    // Resolve API key (same logic as generate.js)
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim()
    if (!apiKey) {
      return res.status(500).json({ detected: null, error: 'No API key configured on server' })
    }

    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } })

    const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
    const base64Data = imageBase64.split(',')[1]

    // Use gemini-3.1-flash-lite for detection (cheapest, fastest)
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: [{
        role: 'user',
        parts: [
          { text: DETECTION_PROMPT },
          { inlineData: { mimeType, data: base64Data } },
        ],
      }],
      config: {
        temperature: 0.1,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    })

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      return res.json({ detected: null, error: 'No text in response' })
    }

    let parsed
    try {
      parsed = JSON.parse(text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim())
    } catch {
      return res.json({ detected: null, error: 'Failed to parse model response' })
    }

    // Validate and map fields
    const detected = {}
    for (const [key, validSet] of Object.entries(VALID_VALUES)) {
      const value = parsed[key]
      if (value && validSet.has(value)) {
        detected[FIELD_MAP[key]] = value
      }
    }

    const elapsed = Date.now() - startTime
    console.log(`[detect] Completed in ${elapsed}ms — detected ${Object.keys(detected).length} fields`)

    return res.json({ detected: Object.keys(detected).length > 0 ? detected : null })
  } catch (err) {
    const elapsed = Date.now() - startTime
    console.error(`[detect] Failed after ${elapsed}ms:`, err.message)
    return res.json({ detected: null, error: err.message })
  }
})

export default router
