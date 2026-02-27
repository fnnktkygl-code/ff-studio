import {
  ENVIRONMENT_DESCRIPTIONS,
  TECHNICAL_CONFIG,
} from './constants'

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

const ISOLATION_INSTRUCTION = `
<TECHNICAL_SPECS>
  CRITICAL BACKGROUND REPLACEMENT: Erase original background entirely.
  Extract ONLY the garment.
  Negative Semantic: floating garment in a neutral empty space, perfectly outlined.
  Do NOT carry over any textures, colors, or lighting from the original reference surface.
</TECHNICAL_SPECS>`.trim()

const FIDELITY_INSTRUCTION = (refCount = 1) => `
<CONTEXT>
  GARMENT FIDELITY: Reference image count: ${refCount}.
  Match EXACTLY color, pattern, print, texture, stitching, buttons, zippers, logos, labels, and proportions.
  Do NOT alter, simplify, or reimagine any design element. 
  Ensure absolute 1:1 design reproduction.
</CONTEXT>`.trim()

const MODESTY_INSTRUCTION = `Strictly professional and modest posture. No suggestive poses, no bare skin on torso.`

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
    referenceImages = 1,
    useSearchGrounding = false,
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
  const fabricText = fabric !== 'any' ? ` made of ${fabric} fabric` : ''
  const fitText = fit !== 'regular' ? `${fit} fit` : ''
  const sizeText = size !== 'm' ? `size ${size.toUpperCase()}` : ''

  const garmentDetails = [garmentName, fabricText, fitText, sizeText].filter(Boolean).join(', ')

  const marketText = targetMarket !== 'global' ? `Target market: ${targetMarket}. Adapt styling to resonate with this market.` : ''
  const brandText = brandStyle !== 'generic' ? `Photography style: Match the iconic e-commerce look of ${brandStyle}.` : ''
  const searchContext = useSearchGrounding ? 'Use Google Search grounding to match current architectural and lighting trends for the background.' : ''

  return MODEL_POSES.map(pose => {
    return `
<INSTRUCTIONS>
  ROLE: Expert Fashion Photographer
  TASK: Generate a photorealistic fashion photograph.
  SUBJECT: ${subjectDescription} wearing the exact ${garmentDetails} from the reference image(s).
  POSE: ${pose}
  FRAMING: ${focusText}
  ENVIRONMENT: ${envDesc}
  ${brandText}
  ${marketText}
  ${searchContext}
  ${MODESTY_INSTRUCTION}
</INSTRUCTIONS>

${ISOLATION_INSTRUCTION}
${FIDELITY_INSTRUCTION(referenceImages)}

<OUTPUT_FORMAT>
  Resolution: ${TECHNICAL_CONFIG.imageSize || '2K'}
  Aspect Ratio: ${TECHNICAL_CONFIG.aspectRatio || '3:4'}
  Style: Premium e-commerce quality, 8K, color-accurate, photorealistic.
</OUTPUT_FORMAT>
    `.trim()
  })
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
    referenceImages = 1,
    useSearchGrounding = false,
  } = options

  const envDesc = ENVIRONMENT_DESCRIPTIONS[environment] || ENVIRONMENT_DESCRIPTIONS['studio-white']
  const garmentName = GARMENT_NAMES[garmentType] || garmentType
  const shots = PRODUCT_SHOTS[productStyle] || PRODUCT_SHOTS['ghost-mannequin']
  const fabricText = fabric !== 'any' ? ` made of ${fabric} fabric` : ''
  const fitText = fit !== 'regular' ? `${fit} fit` : ''
  const sizeText = size !== 'm' ? `size ${size.toUpperCase()}` : ''

  const garmentDetails = [garmentName, fabricText, fitText, sizeText].filter(Boolean).join(', ')
  const bodyShape = `Shaped for a ${modelType} body silhouette.`

  const brandText = brandStyle !== 'generic' ? `Photography style: Match the product photography aesthetic of ${brandStyle}.` : ''
  const marketText = targetMarket !== 'global' ? `Optimized for ${targetMarket} e-commerce market.` : ''
  const searchContext = useSearchGrounding ? 'Use Google Search grounding to match current architectural and lighting trends for the background.' : ''

  return shots.map(shot => {
    return `
<INSTRUCTIONS>
  ROLE: Expert Product Photographer
  TASK: Generate a photorealistic product photograph. NO PEOPLE in the image.
  SUBJECT: Exact ${garmentDetails} from the reference image(s). ${bodyShape}
  STYLE: ${productStyle.toUpperCase()}
  PRESENTATION: ${shot}
  REQUIREMENT: Floating effect, natural fabric drape, showing interior lining where applicable.
  ENVIRONMENT: ${envDesc}
  ${brandText}
  ${marketText}
  ${searchContext}
</INSTRUCTIONS>

${ISOLATION_INSTRUCTION}
${FIDELITY_INSTRUCTION(referenceImages)}

<OUTPUT_FORMAT>
  Resolution: ${TECHNICAL_CONFIG.imageSize || '2K'}
  Aspect Ratio: ${TECHNICAL_CONFIG.aspectRatio || '3:4'}
  Style: Sharp focus on garment details, color-calibrated, premium e-commerce product photography.
</OUTPUT_FORMAT>
    `.trim()
  })
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
    guandura: 'Model walks with a slow, dignified pace, showing the elegant flow of the traditional dress with each step.',
    abaya: 'Model walks gracefully, showcasing the modest drape and movement of the abaya fabric.',
  }

  return [
    `CINEMATIC FASHION VIDEO`,
    ISOLATION_INSTRUCTION,
    FIDELITY_INSTRUCTION(),
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
