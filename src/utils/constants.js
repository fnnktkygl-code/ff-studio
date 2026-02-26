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
  { value: 'shoes', label: 'Shoes / Sneakers' },
  { value: 'sweater', label: 'Sweater' },
  { value: 'jacket', label: 'Jacket / Coat' },
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
  { value: 'west-africa', label: 'West Africa' },
]

// ─── AI Model Selection ────────────────────────────────────────────────────────
// Best-value models available on Vertex AI for fashion image generation.
// Gemini 2.5 Flash Image is recommended as default: best image-to-image
// understanding (follows complex garment + scene prompts).

export const AI_MODEL_OPTIONS = [
  {
    value: 'gemini-2.5-flash-image',
    label: 'Gemini 2.5 Flash',
    sublabel: 'Best quality · $0.134/img',
    recommended: true,
  },
  {
    value: 'imagen-4-fast',
    label: 'Imagen 4 Fast',
    sublabel: 'Fastest · $0.02/img',
    recommended: false,
  },
  {
    value: 'imagen-4',
    label: 'Imagen 4',
    sublabel: 'Balanced · $0.04/img',
    recommended: false,
  },
  {
    value: 'imagen-4-ultra',
    label: 'Imagen 4 Ultra',
    sublabel: 'Ultra quality · $0.06/img',
    recommended: false,
  },
]

// ─── Vertex AI Pricing (official rates) ────────────────────────────────────────
// Source: https://cloud.google.com/vertex-ai/generative-ai/pricing
//
// Gemini 2.5 Flash — image generation (image output tokens):
//   1 024×1 024 output image = 1 120 tokens
//   Image output token rate = $0.12 / 1M tokens
//   → $0.1344 per image ≈ $0.134/image
//
// Gemini 2.5 Flash — text input tokens:
//   ≤200K context: $0.15 / 1M input tokens
//
// Imagen 4 per-image pricing (flat rate, no token math):
//   Imagen 4 Fast : $0.02/image
//   Imagen 4      : $0.04/image
//   Imagen 4 Ultra: $0.06/image

// Vertex AI pricing page explicitly states:
// "Une image de sortie 1K (1024×1024) consomme 1 120 jetons de sortie d'image,
//  soit l'équivalent de 0,134 $ par image générée."
// → We use $0.134/image directly for Gemini 2.5 Flash image output.
export const IMAGE_OUTPUT_TOKENS_PER_IMAGE = 1120
export const COST_PER_GEMINI_IMAGE = 0.134

export const INPUT_TEXT_COST_PER_MILLION_TOKENS = 0.15   // $0.15/1M input tokens (≤200K ctx)
export const INPUT_TEXT_COST_PER_TOKEN = INPUT_TEXT_COST_PER_MILLION_TOKENS / 1_000_000

export const PRICING_PROFILES = {
  'gemini-2.5-flash-image': {
    imageCost: COST_PER_GEMINI_IMAGE,
    inputTokenCost: INPUT_TEXT_COST_PER_TOKEN,
    label: 'Gemini 2.5 Flash Image',
  },
  'gemini-2.5-flash-image-preview': {
    imageCost: COST_PER_GEMINI_IMAGE,
    inputTokenCost: INPUT_TEXT_COST_PER_TOKEN,
    label: 'Gemini 2.5 Flash Image Preview',
  },
  'imagen-4-fast': {
    imageCost: 0.02,
    inputTokenCost: 0,
    label: 'Imagen 4 Fast',
  },
  'imagen-4': {
    imageCost: 0.04,
    inputTokenCost: 0,
    label: 'Imagen 4',
  },
  'imagen-4-ultra': {
    imageCost: 0.06,
    inputTokenCost: 0,
    label: 'Imagen 4 Ultra',
  },
}

export function normalizePricingModel(modelName = '') {
  const normalized = String(modelName || '').trim().toLowerCase()
  if (!normalized) return 'gemini-2.5-flash-image'
  if (normalized.includes('imagen-4-ultra')) return 'imagen-4-ultra'
  if (normalized.includes('imagen-4-fast')) return 'imagen-4-fast'
  if (normalized.includes('imagen-4')) return 'imagen-4'
  if (normalized.includes('gemini-2.5-flash-image-preview')) return 'gemini-2.5-flash-image-preview'
  if (normalized.includes('gemini-2.5-flash-image') || normalized.includes('gemini')) return 'gemini-2.5-flash-image'
  return 'gemini-2.5-flash-image'
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
