export const MODEL_TYPES = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'kids', label: 'Kids' },
]

export const ETHNICITIES = [
  { value: 'any', label: 'Any / Diverse' },
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black' },
  { value: 'caucasian', label: 'Caucasian' },
  { value: 'hispanic', label: 'Hispanic' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
  { value: 'south-asian', label: 'South Asian' },
  { value: 'algerian', label: 'Algerian / North African' },
]

export const ENVIRONMENTS = [
  { value: 'studio-white', label: 'White Studio' },
  { value: 'studio-gray', label: 'Gray Studio' },
  { value: 'cozy-indoor', label: 'Cozy Indoor' },
  { value: 'urban-street', label: 'Urban Street' },
  { value: 'nature', label: 'Nature' },
  { value: 'luxury-interior', label: 'Luxury Interior' },
  { value: 'beach', label: 'Beach' },
]

export const GARMENT_TYPES = [
  { value: 'top', label: 'Shirt / Top' },
  { value: 'dress', label: 'Dress' },
  { value: 'pants', label: 'Pants' },
  { value: 'skirt', label: 'Skirt' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'shoes', label: 'Shoes / Sneakers' },
  { value: 'sweater', label: 'Sweater / Pull' },
  { value: 'jacket', label: 'Jacket / Doudoune' },
  { value: 'guandura', label: 'Guandura / Gandoura' },
  { value: 'abaya', label: 'Abaya' },
]

export const PRODUCT_STYLES = [
  { value: 'ghost-mannequin', label: 'Ghost Mannequin' },
  { value: 'flat-lay', label: 'Flat Lay' },
  { value: 'hanging', label: 'Hanging' },
  { value: 'folded', label: 'Folded' },
]

export const BRAND_STYLES = [
  { value: 'generic', label: 'Modern Generic' },
  { value: 'zara', label: 'Zara' },
  { value: 'ralph-lauren', label: 'Ralph Lauren' },
  { value: 'hm', label: 'H&M' },
  { value: 'nike', label: 'Nike' },
  { value: 'asos', label: 'ASOS' },
  { value: 'gucci', label: 'Gucci' },
]

export const FABRICS = [
  { value: 'any', label: 'Any' },
  { value: 'cotton', label: 'Cotton' },
  { value: 'silk', label: 'Silk / Satin' },
  { value: 'denim', label: 'Denim' },
  { value: 'wool', label: 'Wool / Knit' },
  { value: 'linen', label: 'Linen' },
  { value: 'leather', label: 'Leather' },
  { value: 'activewear', label: 'Activewear' },
]

export const FITS = [
  { value: 'regular', label: 'Regular' },
  { value: 'tight', label: 'Fitted / Tight' },
  { value: 'oversized', label: 'Oversized' },
  { value: 'cropped', label: 'Cropped' },
  { value: 'longline', label: 'Longline' },
]

export const SIZES = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: 'xxl', label: 'XXL' },
]

export const TARGET_MARKETS = [
  { value: 'global', label: 'Global' },
  { value: 'usa', label: 'USA' },
  { value: 'japan', label: 'Japan' },
  { value: 'france', label: 'France' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'uk', label: 'UK' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'north-africa', label: 'North Africa' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'west-africa', label: 'West Africa' },
]

// ─── AI Model Selection ────────────────────────────────────────────────────────
// Best-value models available on Vertex AI for fashion image generation.
// Gemini 2.5 Flash Image is recommended as default: best image-to-image
// understanding (follows complex garment + scene prompts).

export const AI_MODEL_OPTIONS = [
  {
    value: 'gemini-3.1-pro-preview',
    label: 'Gemini 3.1 Pro Preview',
    sublabel: '🔥 Nano Banana 2 · ~$0.134/img',
    recommended: true,
  },
  {
    value: 'gemini-3.0-pro-preview',
    label: 'Gemini 3 Pro Preview',
    sublabel: 'Latest Pro · ~$0.134/img',
    recommended: false,
  },
  {
    value: 'gemini-2.5-flash-image',
    label: 'Gemini 1.5 Pro (Gen 2.5)',
    sublabel: 'Balanced · ~$0.134/img',
    recommended: false,
  },
  {
    value: 'imagen-4',
    label: 'Imagen 4',
    sublabel: 'Creative · $0.04/img',
    recommended: false,
  },
]

export const HEADWEAR_OPTIONS = [
  { value: 'none', label: 'No Headwear' },
  { value: 'hijab', label: 'Hijab / Modest Cover' },
]

export const VIDEO_MODEL_OPTIONS = [
  {
    value: 'veo-2.0-generate-001',
    label: 'Veo 2 · 720p',
    sublabel: '✅ Available now — $0.50/sec (~$4/8s clip)',
    recommended: true,
  },
  {
    value: 'veo-3.1-fast-generate-001:1080p',
    label: 'Veo 3.1 Fast · 1080p',
    sublabel: 'Best value — $0.10/sec (~$0.80/8s clip)',
  },
  {
    value: 'veo-3.1-fast-generate-001:4k',
    label: 'Veo 3.1 Fast · 4K',
    sublabel: 'Ultra-HD fast — $0.30/sec (~$2.40/8s clip)',
  },
  {
    value: 'veo-3.1-generate-001:1080p',
    label: 'Veo 3.1 · 1080p',
    sublabel: 'Max quality Full HD — $0.20/sec (~$1.60/8s clip)',
  },
  {
    value: 'veo-3.1-generate-001:4k',
    label: 'Veo 3.1 · 4K',
    sublabel: 'Absolute maximum — $0.40/sec (~$3.20/8s clip)',
  },
]

// ─── Vertex AI Pricing (official rates) ────────────────────────────────────────
// Source: User provided Gemini 3.1 pricing table
//
// Gemini 3.1 Pro Preview — image generation (image output tokens):
//   1 024×1 024 output image = 1 120 tokens
//   Image output token rate = $120 / 1M tokens
//   → $0.1344 per image ≈ $0.134/image
//
//   4 096×4 096 output image = 2 000 tokens
//   Image output token rate = $120 / 1M tokens
//   → $0.24 per image
//
// Gemini 3.1 Pro Preview — text input tokens:
//   ≤200K context: $2.00 / 1M input tokens
//
// Imagen 4 per-image pricing (flat rate):
//   Imagen 4      : $0.04/image

export const IMAGE_OUTPUT_TOKENS_PER_IMAGE = 1120
export const COST_PER_GEMINI_IMAGE = 0.134

export const INPUT_TEXT_COST_PER_MILLION_TOKENS = 2.00   // $2.00/1M input tokens (≤200K ctx)
export const INPUT_TEXT_COST_PER_TOKEN = INPUT_TEXT_COST_PER_MILLION_TOKENS / 1_000_000

export const PRICING_PROFILES = {
  'gemini-3.1-pro-preview': {
    imageCost: 0.134,
    inputTokenCost: 0.000002, // $2 / 1M tokens
    label: 'Gemini 3.1 Pro Preview',
  },
  'gemini-3.0-pro-preview': {
    imageCost: 0.134,
    inputTokenCost: 0.000002, // $2 / 1M tokens
    label: 'Gemini 3 Pro Preview',
  },
  'gemini-2.5-flash-image': {
    imageCost: 0.134,
    inputTokenCost: 0.00000015, // $0.15 / 1M tokens
    label: 'Gemini 2.5 Flash Image',
  },
  'imagen-4': {
    imageCost: 0.04,
    inputTokenCost: 0,
    label: 'Imagen 4',
  },
}

export function normalizePricingModel(modelName = '') {
  const normalized = String(modelName || '').trim().toLowerCase()
  if (!normalized) return 'gemini-3.1-pro-preview'
  if (normalized.includes('imagen-4')) return 'imagen-4'
  if (normalized.includes('gemini-3.1')) return 'gemini-3.1-pro-preview'
  if (normalized.includes('gemini-3.0') || normalized.includes('gemini-3-pro')) return 'gemini-3.0-pro-preview'
  if (normalized.includes('gemini-2.5') || normalized.includes('gemini')) return 'gemini-2.5-flash-image'
  return 'gemini-3.1-pro-preview'
}

export function getPricingProfile(modelName = '') {
  const key = normalizePricingModel(modelName)
  return PRICING_PROFILES[key]
}

// Kept configurable for your video workflow (Veo Fast 720/1080 baseline)
export const COST_PER_VIDEO_SECOND = 0.10

export const MAX_IMAGES = 4

export const OUTPUT_COUNTS = [1, 2, 3, 4].map((count) => ({
  value: String(count),
  label: `${count} image${count > 1 ? 's' : ''}`,
}))
