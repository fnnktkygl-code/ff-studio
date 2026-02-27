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

export const ENVIRONMENT_DESCRIPTIONS = {
  'studio-white': 'Clean white cyclorama studio background with soft diffused softbox lighting, no shadows, professional fashion photography setup',
  'studio-gray': 'Neutral gray studio background with controlled directional lighting, subtle gradient, professional editorial setup',
  'cozy-indoor': 'Warm cozy indoor setting with soft natural window light, earth-toned decor, lifestyle photography aesthetic',
  'urban-street': 'Modern urban street setting, concrete and glass architecture, natural daylight, street fashion editorial vibe',
  'nature': 'Beautiful outdoor natural setting, soft golden hour lighting, greenery and organic textures, lifestyle photography',
  'luxury-interior': 'High-end luxury interior with marble and warm metallic accents, elegant ambient lighting, premium brand aesthetic',
  'beach': 'Sandy beach setting with ocean background, soft warm sunlight, relaxed resort photography style',
}

export const GARMENT_CATEGORIES = [
  { value: 'all', label: 'All', emoji: '✨' },
  { value: 'tops', label: 'Tops', emoji: '👕' },
  { value: 'bottoms', label: 'Bottoms', emoji: '👖' },
  { value: 'dresses', label: 'Dresses', emoji: '👗' },
  { value: 'outerwear', label: 'Outerwear', emoji: '🧥' },
  { value: 'traditional', label: 'Traditional', emoji: '🎌' },
  { value: 'footwear', label: 'Footwear', emoji: '👟' },
  { value: 'accessories', label: 'Accessories', emoji: '👜' },
]

export const GARMENT_TYPES = [
  // Tops
  { value: 'shirt', label: 'Shirt', emoji: '👔', category: 'tops', desc: 'Classic woven top' },
  { value: 'tshirt', label: 'T-Shirt', emoji: '👕', category: 'tops', desc: 'Casual knit cotton' },
  { value: 'polo', label: 'Polo', emoji: '👕', category: 'tops', desc: 'Sporty knit collar' },
  { value: 'blouse', label: 'Blouse', emoji: '👚', category: 'tops', desc: 'Elegant feminine top' },
  { value: 'tanktop', label: 'Tank Top', emoji: '🩱', category: 'tops', desc: 'Sleeveless summer top' },
  { value: 'croptop', label: 'Crop Top', emoji: '👕', category: 'tops', desc: 'Short midriff-baring top' },
  // Bottoms
  { value: 'pants', label: 'Pants', emoji: '👖', category: 'bottoms', desc: 'Formal trousers' },
  { value: 'jeans', label: 'Jeans', emoji: '👖', category: 'bottoms', desc: 'Denim trousers' },
  { value: 'chinos', label: 'Chinos', emoji: '🟤', category: 'bottoms', desc: 'Casual twill pants' },
  { value: 'shorts', label: 'Shorts', emoji: '🩳', category: 'bottoms', desc: 'Short trousers' },
  { value: 'skirt', label: 'Skirt', emoji: '👗', category: 'bottoms', desc: 'Classic skirt' },
  { value: 'miniskirt', label: 'Mini Skirt', emoji: '👗', category: 'bottoms', desc: 'Short above-knee skirt' },
  // Dresses
  { value: 'dress', label: 'Dress', emoji: '👗', category: 'dresses', desc: 'Casual everyday dress' },
  { value: 'eveningdress', label: 'Evening Dress', emoji: '👘', category: 'dresses', desc: 'Formal gala dress' },
  { value: 'maxidress', label: 'Maxi Dress', emoji: '👗', category: 'dresses', desc: 'Floor-length dress' },
  { value: 'jumpsuit', label: 'Jumpsuit', emoji: '🧶', category: 'dresses', desc: 'One-piece full outfit' },
  // Outerwear
  { value: 'jacket', label: 'Jacket', emoji: '🧥', category: 'outerwear', desc: 'Classic jacket' },
  { value: 'doudoune', label: 'Puffer / Doudoune', emoji: '🧥', category: 'outerwear', desc: 'Quilted padded jacket' },
  { value: 'blazer', label: 'Blazer', emoji: '🧥', category: 'outerwear', desc: 'Tailored formal jacket' },
  { value: 'hoodie', label: 'Hoodie', emoji: '🧥', category: 'outerwear', desc: 'Hooded sweatshirt' },
  { value: 'sweater', label: 'Sweater / Pull', emoji: '🧶', category: 'outerwear', desc: 'Warm knitwear' },
  { value: 'cardigan', label: 'Cardigan', emoji: '🧶', category: 'outerwear', desc: 'Open-front knitwear' },
  { value: 'raincoat', label: 'Raincoat', emoji: '🌧️', category: 'outerwear', desc: 'Waterproof outer layer' },
  // Traditional
  { value: 'guandura', label: 'Gandoura', emoji: '🎌', category: 'traditional', desc: 'North African robe' },
  { value: 'abaya', label: 'Abaya', emoji: '🎌', category: 'traditional', desc: 'Full-length outer garment' },
  { value: 'kaftan', label: 'Kaftan', emoji: '🎌', category: 'traditional', desc: 'Long flowing robe' },
  { value: 'djellaba', label: 'Djellaba', emoji: '🎌', category: 'traditional', desc: 'Hooded robe' },
  { value: 'boubou', label: 'Boubou', emoji: '🎌', category: 'traditional', desc: 'West African grand boubou' },
  // Footwear
  { value: 'shoes', label: 'Sneakers', emoji: '👟', category: 'footwear', desc: 'Athletic or casual shoes' },
  { value: 'heels', label: 'Heels', emoji: '👠', category: 'footwear', desc: 'Elevated formal shoes' },
  { value: 'boots', label: 'Boots', emoji: '👢', category: 'footwear', desc: 'Ankle or knee-high boots' },
  { value: 'sandals', label: 'Sandals', emoji: '🩴', category: 'footwear', desc: 'Open-toe summer shoes' },
  { value: 'loafers', label: 'Loafers', emoji: '👞', category: 'footwear', desc: 'Slip-on leather shoes' },
  // Accessories
  { value: 'bag', label: 'Bag / Purse', emoji: '👜', category: 'accessories', desc: 'Handbag or shoulder bag' },
  { value: 'cap', label: 'Cap / Hat', emoji: '🧢', category: 'accessories', desc: 'Head wear' },
  { value: 'belt', label: 'Belt', emoji: '👔', category: 'accessories', desc: 'Waist accessory' },
  { value: 'scarf', label: 'Scarf', emoji: '🧣', category: 'accessories', desc: 'Neck wrap accessory' },
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
    value: 'gemini-3.1-flash-image-preview',
    label: 'Gemini 3.1 Flash Image',
    sublabel: '🔥 Nano Banana 2 · ~$0.067/img',
    recommended: true,
  },
  {
    value: 'gemini-3.0-pro-preview',
    label: 'Gemini 3 Pro Image',
    sublabel: '🧠 Nano Banana Pro · ~$0.134/img',
    recommended: false,
  },
  {
    value: 'gemini-2.5-flash-image',
    label: 'Gemini 2.5 Flash Image',
    sublabel: 'Nano Banana · ~$0.034/img',
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

export const IMAGE_RESOLUTION_OPTIONS = [
  { value: '1K', label: '1K (1024x1024)', summary: '~0.13$/img' },
  { value: '2K', label: '2K (2048x2048)', summary: '~0.13$/img' },
  { value: '4K', label: '4K (4096x4096)', summary: '~0.24$/img' },
]

export const IMAGE_OUTPUT_TOKENS = {
  '1K': 1120,
  '2K': 1120, // Billed the same as 1K conceptually, but you can adjust if needed
  '4K': 2000,
}

export const TECHNICAL_CONFIG = {
  aspectRatio: "3:4",
  imageSize: "2K",
  responseModalities: ["IMAGE"],
  safetySettings: "BLOCK_ONLY_HIGH",
  thinkingLevel: "High"
}

export const TOKEN_COST_PER_MILLION = 120 // $120 per 1M output tokens
export const INPUT_TEXT_COST_PER_MILLION_TOKENS = 2.00   // $2.00/1M input tokens

export const PRICING_PROFILES = {
  'gemini-3.1-flash-image-preview': {
    outputTokenCostMillion: 60, // $60/1M tokens = ~$0.067/img
    inputTokenCostMillion: 0.15,
    label: 'Nano Banana 2 (Gemini 3.1 Flash Image)',
  },
  'gemini-3.0-pro-preview': {
    outputTokenCostMillion: 120, // $120/1M tokens = ~$0.134/img
    inputTokenCostMillion: 2.00,
    label: 'Nano Banana Pro (Gemini 3 Pro Image)',
  },
  'gemini-2.5-flash-image': {
    outputTokenCostMillion: 30, // $30/1M tokens = ~$0.034/img
    inputTokenCostMillion: 0.15,
    label: 'Nano Banana (Gemini 2.5 Flash Image)',
  },
}

export function normalizePricingModel(modelName = '') {
  const normalized = String(modelName || '').trim().toLowerCase()
  if (!normalized) return 'gemini-3.1-flash-image-preview'
  if (normalized.includes('gemini-3.0-pro')) return 'gemini-3.0-pro-preview'
  if (normalized.includes('gemini-3.1')) return 'gemini-3.1-flash-image-preview'
  if (normalized.includes('gemini-2.5') || normalized.includes('gemini')) return 'gemini-2.5-flash-image'
  return 'gemini-3.1-flash-image-preview'
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
