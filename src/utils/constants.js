import {
  IconDiverse, IconAsian, IconBlack, IconCaucasian, IconHispanic,
  IconMiddleEastern, IconSouthAsian, IconNorthAfrican
} from '../components/icons/EthnicityIcons'

export const MODEL_TYPES = [
  { value: 'female', label: 'Female', emoji: '👩', desc: 'Female fashion model' },
  { value: 'male', label: 'Male', emoji: '👨', desc: 'Male fashion model' },
  { value: 'kids', label: 'Kids', emoji: '🧒', desc: "Children's fashion" },
]

export const ETHNICITIES = [
  { value: 'any', label: 'Any / Diverse', emoji: <IconDiverse />, desc: 'Diverse representation' },
  { value: 'asian', label: 'Asian', emoji: <IconAsian />, desc: 'East & Southeast Asian' },
  { value: 'black', label: 'Black', emoji: <IconBlack />, desc: 'African / Afro-descent' },
  { value: 'caucasian', label: 'Caucasian', emoji: <IconCaucasian />, desc: 'European features' },
  { value: 'hispanic', label: 'Hispanic', emoji: <IconHispanic />, desc: 'Latin American features' },
  { value: 'middle-eastern', label: 'Middle Eastern', emoji: <IconMiddleEastern />, desc: 'Middle Eastern features' },
  { value: 'south-asian', label: 'South Asian', emoji: <IconSouthAsian />, desc: 'Indian / Pakistani features' },
  { value: 'algerian', label: 'Algerian / N. African', emoji: <IconNorthAfrican />, desc: 'North African Maghreb look' },
]

export const ENVIRONMENTS = [
  { value: 'studio-white', label: 'White Studio', emoji: '⬜', desc: 'Clean white cyclorama' },
  { value: 'studio-gray', label: 'Gray Studio', emoji: '🩶', desc: 'Neutral gray backdrop' },
  { value: 'cozy-indoor', label: 'Cozy Indoor', emoji: '🛋️', desc: 'Warm lifestyle interior' },
  { value: 'urban-street', label: 'Urban Street', emoji: '🏙️', desc: 'City street editorial' },
  { value: 'nature', label: 'Nature', emoji: '🌿', desc: 'Golden hour outdoors' },
  { value: 'luxury-interior', label: 'Luxury Interior', emoji: '✨', desc: 'Marble & metallic decor' },
  { value: 'beach', label: 'Beach', emoji: '🏖️', desc: 'Coastal resort vibes' },
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
  { value: 'traditional', label: 'Traditional', emoji: '🌍' },
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
  { value: 'guandura', label: 'Gandoura', emoji: '🌍', category: 'traditional', desc: 'North African robe' },
  { value: 'abaya', label: 'Abaya', emoji: '🌍', category: 'traditional', desc: 'Full-length outer garment' },
  { value: 'kaftan', label: 'Kaftan', emoji: '🌍', category: 'traditional', desc: 'Long flowing robe' },
  { value: 'djellaba', label: 'Djellaba', emoji: '🌍', category: 'traditional', desc: 'Hooded robe' },
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
  { value: 'ghost-mannequin', label: 'Ghost Mannequin', emoji: '👻', desc: 'Invisible mannequin effect' },
  { value: 'flat-lay', label: 'Flat Lay', emoji: '🛏️', desc: 'Garment laid on flat surface' },
  { value: 'hanging', label: 'Hanging', emoji: '🪝', desc: 'Product on hanger' },
  { value: 'folded', label: 'Folded', emoji: '📦', desc: 'Neatly folded garment' },
]

export const BRAND_STYLES = [
  { value: 'generic', label: 'Modern Generic', emoji: '✨', desc: 'Clean editorial style' },
  { value: 'zara', label: 'Zara', emoji: '🏷️', desc: 'Minimalist European chic' },
  { value: 'ralph-lauren', label: 'Ralph Lauren', emoji: '🐎', desc: 'Preppy American classic' },
  { value: 'hm', label: 'H&M', emoji: '♻️', desc: 'Affordable fast fashion' },
  { value: 'nike', label: 'Nike', emoji: '✔️', desc: 'Athletic sportswear' },
  { value: 'asos', label: 'ASOS', emoji: '🌐', desc: 'Trendy online fashion' },
  { value: 'gucci', label: 'Gucci', emoji: '🐍', desc: 'Luxury italic fashion' },
]

export const FABRICS = [
  { value: 'any', label: 'Any', emoji: '🔀', desc: 'Auto-detect from image' },
  { value: 'cotton', label: 'Cotton', emoji: '🌿', desc: 'Soft breathable fabric' },
  { value: 'silk', label: 'Silk / Satin', emoji: '✨', desc: 'Smooth lustrous fabric' },
  { value: 'denim', label: 'Denim', emoji: '👖', desc: 'Classic woven cotton' },
  { value: 'wool', label: 'Wool / Knit', emoji: '🧶', desc: 'Warm textured weave' },
  { value: 'linen', label: 'Linen', emoji: '🌾', desc: 'Lightweight natural fabric' },
  { value: 'leather', label: 'Leather', emoji: '🐄', desc: 'Genuine or faux leather' },
  { value: 'activewear', label: 'Activewear', emoji: '🏃', desc: 'Stretch performance fabric' },
]

export const FITS = [
  { value: 'regular', label: 'Regular', emoji: '📐', desc: 'Standard everyday cut' },
  { value: 'tight', label: 'Fitted / Tight', emoji: '💪', desc: 'Body-hugging silhouette' },
  { value: 'oversized', label: 'Oversized', emoji: '🌊', desc: 'Relaxed loose silhouette' },
  { value: 'cropped', label: 'Cropped', emoji: '✂️', desc: 'Shortened above waist' },
  { value: 'longline', label: 'Longline', emoji: '📏', desc: 'Extended below the hip' },
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
  { value: 'global', label: 'Global', emoji: '🌍', desc: 'Universal multi-market' },
  { value: 'usa', label: 'USA', emoji: '🇺🇸', desc: 'North American market' },
  { value: 'japan', label: 'Japan', emoji: '🇯🇵', desc: 'East Asian market' },
  { value: 'france', label: 'France', emoji: '🇫🇷', desc: 'West European market' },
  { value: 'brazil', label: 'Brazil', emoji: '🇧🇷', desc: 'Latin American market' },
  { value: 'uk', label: 'UK', emoji: '🇬🇧', desc: 'British market' },
  { value: 'south-korea', label: 'South Korea', emoji: '🇰🇷', desc: 'K-fashion forward market' },
  { value: 'north-africa', label: 'North Africa', emoji: '🌙', desc: 'MENA region market' },
  { value: 'algeria', label: 'Algeria', emoji: '🇩🇿', desc: 'Algerian e-commerce' },
  { value: 'west-africa', label: 'West Africa', emoji: '🌍', desc: 'West African market' },
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
  { value: 'none', label: 'No Headwear', emoji: '👤', desc: 'Natural hair display' },
  { value: 'hijab', label: 'Hijab / Traditional Wrap', emoji: '🧕', desc: 'Secure head wrap cover' },
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
  { value: '1K', label: '1K (1024x1024)', emoji: '🖼️', desc: 'Optimal speed & cost' },
  { value: '2K', label: '2K (2048x2048)', emoji: '🌟', desc: 'High fidelity sharpness' },
  { value: '4K', label: '4K (4096x4096)', emoji: '💎', desc: 'Maximum print quality' },
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
