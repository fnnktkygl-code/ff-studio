const ENVIRONMENT_DESCRIPTIONS = {
  'studio-white': 'Clean white cyclorama studio background with soft diffused softbox lighting, no shadows, professional fashion photography setup',
  'studio-gray': 'Neutral gray studio background with controlled directional lighting, subtle gradient, professional editorial setup',
  'cozy-indoor': 'Warm cozy indoor setting with soft natural window light, earth-toned decor, lifestyle photography aesthetic',
  'urban-street': 'Modern urban street setting, concrete and glass architecture, natural daylight, street fashion editorial vibe',
  'nature': 'Beautiful outdoor natural setting, soft golden hour lighting, greenery and organic textures, lifestyle photography',
  'luxury-interior': 'High-end luxury interior with marble and warm metallic accents, elegant ambient lighting, premium brand aesthetic',
  'beach': 'Sandy beach setting with ocean background, soft warm sunlight, relaxed resort photography style',
}

const FOCUS_INSTRUCTIONS = {
  top: 'Frame the UPPER BODY from waist up. The shirt/top is the main subject — do NOT crop it. Do NOT show legs or feet.',
  dress: 'Frame the FULL BODY to capture the entire dress length, from head to shoes.',
  pants: 'Frame from WAIST to FEET. The pants are the main subject. The model MUST wear a plain, modest, fully-covering neutral top (e.g., white t-shirt). NO bare midriff.',
  shoes: 'EXTREME CLOSE-UP on the FEET and lower legs only. The footwear is the main subject. Do NOT show the upper body.',
  sweater: 'Frame the UPPER BODY from waist up. The sweater is the main subject — do NOT crop it.',
  jacket: 'Frame UPPER BODY or 3/4 body. The jacket/coat is the main subject — show it fully open or styled naturally.',
  guandura: 'Frame the FULL BODY to capture the entire flowing guandura length, showing the traditional cut.',
  abaya: 'Frame the FULL BODY to capture the loose flowing abaya length, from head to shoes.',
}

const GARMENT_NAMES = {
  top: 'shirt/top',
  dress: 'dress',
  pants: 'pants/trousers',
  shoes: 'shoes/sneakers',
  sweater: 'sweater/knitwear',
  jacket: 'jacket/coat',
  guandura: 'guandura/gandoura traditional dress',
  abaya: 'modest abaya dress',
}

const MODEL_POSES = [
  'Front-facing pose, standing straight with relaxed arms, confident professional posture',
  'Natural walking pose, mid-stride with elegant fluid movement, arms swinging naturally',
  'Casual relaxed pose, weight shifted to one hip, one hand on hip or in pocket, approachable look',
  'Editorial high-fashion angle, subtle elegant turn showing garment dimension, sophisticated pose',
]

const PRODUCT_SHOTS = {
  'ghost-mannequin': [
    'Professional invisible/ghost mannequin presentation, front view, garment appears to float with natural shape',
    'Ghost mannequin presentation, slight 3/4 angle, showing garment dimension and drape',
    'Extreme close-up macro detail shot focusing on fabric texture, stitching, and construction quality',
    'Ghost mannequin back view, showing rear details, seams, and label placement',
  ],
  'flat-lay': [
    'Professional flat lay, garment neatly arranged from above, crisp styling, geometric precision',
    'Creative flat lay with garment artfully arranged, showing natural fabric drape and movement',
    'Close-up flat lay detail shot, focusing on unique design elements, buttons, or hardware',
    'Styled flat lay with minimal complementary accessories arranged around the garment',
  ],
  'hanging': [
    'Garment hanging on premium wooden hanger, front view, natural drape showing silhouette',
    'Hanging presentation at slight angle, showing fabric weight and movement',
    'Close-up of garment on hanger, focusing on neckline/collar details and construction',
    'Full hanging shot showing garment length and proportions, clean background',
  ],
  'folded': [
    'Neatly folded garment, front branding/design visible, professional product shot',
    'Artfully folded stack presentation, showing color and fabric richness',
    'Close-up of folded garment edge, emphasizing fabric quality and texture',
    'Folded garment with one corner casually pulled back to reveal interior/lining',
  ],
}

const ISOLATION_INSTRUCTION = `CRITICAL BACKGROUND REPLACEMENT: The reference image(s) may show the garment on any surface (carpet, floor, bed, table, mannequin, or person). You MUST completely ignore and erase that original background/surface. Extract ONLY the garment design. The final image must be set ENTIRELY in the new environment described below. Do NOT carry over any textures, colors, or elements from the reference background.`

const FIDELITY_INSTRUCTION = `GARMENT FIDELITY: The garment in the output MUST EXACTLY match the reference image(s) in every detail — identical color, pattern, print, texture, stitching, buttons, zippers, logos, labels, and proportions. Do NOT alter, simplify, or reimagine any design element. If multiple reference angles are provided, use them all to ensure accuracy.`

const MODESTY_INSTRUCTION = `Strictly professional and modest posture. No suggestive poses, no bare skin on torso, no inappropriate styling.`

export function buildModelPrompts(options) {
  const {
    modelType = 'female',
    ethnicity = 'any',
    environment = 'studio-white',
    garmentType = 'top',
    brandStyle = 'generic',
    fabric = 'any',
    fit = 'regular',
    size = 'm',
    targetMarket = 'global',
    headwear = 'none',
  } = options

  const isSkirtOrShorts = ['skirt', 'shorts'].includes(garmentType)
  const actualHeadwear = isSkirtOrShorts ? 'none' : headwear

  const modelText = modelType === 'female' ? 'female fashion model' : modelType === 'male' ? 'male fashion model' : 'child fashion model'
  const ethText = ethnicity !== 'any' ? `${ethnicity} ` : ''
  const hijabText = actualHeadwear === 'hijab' ? 'wearing a stylish modest hijab coordinated with the outfit' : ''
  const subjectDescription = [ethText, modelText, hijabText].filter(Boolean).join(' ')

  const envDesc = ENVIRONMENT_DESCRIPTIONS[environment] || ENVIRONMENT_DESCRIPTIONS['studio-white']
  const garmentName = GARMENT_NAMES[garmentType] || garmentType
  const focusText = FOCUS_INSTRUCTIONS[garmentType] || ''
  const fabricText = fabric !== 'any' ? `, made of ${fabric} fabric` : ''
  const fitText = fit !== 'regular' ? `, ${fit} fit` : ''
  const sizeText = size !== 'm' ? `, size ${size.toUpperCase()}` : ''
  const marketText = targetMarket !== 'global' ? `\nTarget market: ${targetMarket}. Adapt the model's styling, pose, and overall vibe to resonate with this market's fashion aesthetic.` : ''
  const brandText = brandStyle !== 'generic' ? `\nPhotography style: Match the iconic e-commerce catalog look of ${brandStyle} — their typical lighting, composition, and visual aesthetic.` : ''

  return MODEL_POSES.map(pose => [
    `VIRTUAL FASHION PHOTOGRAPHY`,
    ISOLATION_INSTRUCTION,
    FIDELITY_INSTRUCTION,
    `Generate a completely new, photorealistic fashion photograph.`,
    `Subject: ${subjectDescription} wearing the exact ${garmentName}${fabricText}${sizeText}${fitText} from the reference image(s).`,
    `Environment: ${envDesc}`,
    `Framing: ${focusText}`,
    `Pose: ${pose}`,
    MODESTY_INSTRUCTION,
    brandText,
    marketText,
    `Technical: Photorealistic, 8K resolution, portrait orientation (3:4 aspect ratio), shallow depth of field on garment details, color-accurate, premium e-commerce quality.`,
    `Do NOT change the garment color, pattern, or design. Do NOT add accessories not in the reference.`,
  ].filter(Boolean).join('\n\n'))
}

export function buildProductPrompts(options) {
  const {
    environment = 'studio-white',
    garmentType = 'top',
    productStyle = 'ghost-mannequin',
    modelType = 'female',
    brandStyle = 'generic',
    fabric = 'any',
    fit = 'regular',
    size = 'm',
    targetMarket = 'global',
  } = options

  const envDesc = ENVIRONMENT_DESCRIPTIONS[environment] || ENVIRONMENT_DESCRIPTIONS['studio-white']
  const garmentName = GARMENT_NAMES[garmentType] || garmentType
  const shots = PRODUCT_SHOTS[productStyle] || PRODUCT_SHOTS['ghost-mannequin']
  const fabricText = fabric !== 'any' ? `, made of ${fabric} fabric` : ''
  const fitText = fit !== 'regular' ? `, ${fit} fit` : ''
  const sizeText = size !== 'm' ? `, size ${size.toUpperCase()}` : ''
  const bodyShape = `. Shaped for a ${modelType} body silhouette`
  const brandText = brandStyle !== 'generic' ? `\nPhotography style: Match the product photography aesthetic of ${brandStyle}.` : ''
  const marketText = targetMarket !== 'global' ? `\nOptimized for ${targetMarket} e-commerce market.` : ''

  return shots.map(shot => [
    `E-COMMERCE PRODUCT PHOTOGRAPHY`,
    ISOLATION_INSTRUCTION,
    FIDELITY_INSTRUCTION,
    `Generate a completely new, photorealistic product photograph of the exact ${garmentName}${fabricText}${sizeText}${fitText} from the reference image(s)${bodyShape}.`,
    `Presentation: ${shot}`,
    `Environment: ${envDesc}`,
    brandText,
    marketText,
    `Technical: Photorealistic, 8K resolution, portrait orientation (3:4 aspect ratio), sharp focus on garment details, color-calibrated, premium e-commerce product photography.`,
    `NO PEOPLE in the image — clothing/product only.`,
    `Do NOT change the garment color, pattern, or design.`,
  ].filter(Boolean).join('\n\n'))
}

export function buildVideoPrompt(options) {
  const {
    modelType = 'female',
    ethnicity = 'any',
    environment = 'studio-white',
    garmentType = 'top',
    fit = 'regular',
    headwear = 'none',
    brandStyle = 'generic',
  } = options

  const isSkirtOrShorts = ['skirt', 'shorts'].includes(garmentType)
  const actualHeadwear = isSkirtOrShorts ? 'none' : headwear

  const modelText = modelType === 'female' ? 'female fashion model' : modelType === 'male' ? 'male fashion model' : 'child fashion model'
  const ethText = ethnicity !== 'any' ? `${ethnicity} ` : ''
  const hijabText = actualHeadwear === 'hijab' ? 'wearing a stylish modest hijab' : ''
  const subjectDescription = [ethText, modelText, hijabText].filter(Boolean).join(' ')

  const envDesc = ENVIRONMENT_DESCRIPTIONS[environment] || ENVIRONMENT_DESCRIPTIONS['studio-white']
  const garmentName = GARMENT_NAMES[garmentType] || garmentType
  const fitText = fit !== 'regular' ? `, ${fit} fit` : ''
  const focusText = FOCUS_INSTRUCTIONS[garmentType] || ''
  const brandText = brandStyle !== 'generic' ? ` Cinematic style matching the ${brandStyle} brand aesthetic.` : ''

  const actions = {
    top: 'Model walks toward camera, pauses, and naturally adjusts the collar. Smooth, confident movement.',
    dress: 'Model walks elegantly, performs a graceful half-turn allowing the dress fabric to flow, then poses confidently.',
    pants: 'Model walks forward, does a smooth half-turn to show the back fit, places one hand in pocket, then walks off.',
    shoes: 'Close-up of feet walking on set, rotating the ankle to display all angles of the footwear.',
    sweater: 'Model walks forward, crosses arms briefly to show sleeve texture, then drops arms for a clean front view.',
    jacket: 'Model walks forward, opens and closes the jacket once to show the lining, adjusts the lapels mid-stride.',
  }

  return [
    `CINEMATIC FASHION VIDEO`,
    ISOLATION_INSTRUCTION,
    FIDELITY_INSTRUCTION,
    `Video Prompt: Create a realistic, high quality, cinematic video.`,
    `Subject: ${subjectDescription} wearing the exact ${garmentName}${fitText} shown in the provided image.`,
    `${focusText}`,
    `Action: ${actions[garmentType] || actions.top}`,
    `Setting: ${envDesc}.${brandText}`,
    MODESTY_INSTRUCTION,
    `Professional e-commerce fashion video, soft cinematic lighting, smooth fluid motion, ultra-detailed, photorealistic.`,
  ].filter(Boolean).join('\n\n')
}

export function buildAllPrompts(options) {
  const { mode = 'model', generateVideo = false } = options
  const requestedCount = Math.min(Math.max(Number(options.outputCount || 4), 1), 4)
  let imagePrompts = []

  if (mode === 'model' || mode === 'both') {
    const modelPrompts = buildModelPrompts(options)
    if (mode === 'both') {
      const modelCount = Math.ceil(requestedCount / 2)
      imagePrompts = [...imagePrompts, ...modelPrompts.slice(0, modelCount)]
    } else {
      imagePrompts = [...imagePrompts, ...modelPrompts.slice(0, requestedCount)]
    }
  }
  if (mode === 'product' || mode === 'both') {
    const productPrompts = buildProductPrompts(options)
    if (mode === 'both') {
      const productCount = Math.floor(requestedCount / 2)
      imagePrompts = [...imagePrompts, ...productPrompts.slice(0, productCount)]
    } else {
      imagePrompts = [...imagePrompts, ...productPrompts.slice(0, requestedCount)]
    }
  }

  // Safety in case both mode split returns less than requestedCount
  if (imagePrompts.length < requestedCount) {
    const modelPrompts = buildModelPrompts(options)
    const productPrompts = buildProductPrompts(options)
    const extra = [...modelPrompts, ...productPrompts].slice(0, requestedCount - imagePrompts.length)
    imagePrompts = [...imagePrompts, ...extra]
  }

  imagePrompts = imagePrompts.slice(0, requestedCount)

  const videoPrompt = generateVideo && (mode === 'model' || mode === 'both')
    ? buildVideoPrompt(options)
    : null

  return { imagePrompts, videoPrompt }
}

export function applyFeedbackToPrompt(prompt, feedback) {
  const cleanFeedback = (feedback || '').trim()
  if (!cleanFeedback) return prompt

  return [
    prompt,
    '',
    'REVISION REQUEST:',
    cleanFeedback,
    'Keep all other constraints unchanged. Preserve the same garment fidelity and scene quality.',
  ].join('\n')
}
