export function validateGenerateRequest(req, res, next) {
  const { images, prompts } = req.body

  if (!images || !Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'At least one image is required.' })
  }

  if (images.length > 4) {
    return res.status(400).json({ error: 'Maximum 4 images allowed.' })
  }

  for (let i = 0; i < images.length; i++) {
    if (!images[i].data || !images[i].mimeType) {
      return res.status(400).json({ error: `Image ${i + 1} is missing data or mimeType.` })
    }
    // Check approximate base64 size (rough: base64 is ~1.33x of original)
    const sizeInBytes = (images[i].data.length * 3) / 4
    if (sizeInBytes > 10 * 1024 * 1024) {
      return res.status(400).json({ error: `Image ${i + 1} exceeds 10MB limit.` })
    }
  }

  if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
    return res.status(400).json({ error: 'At least one prompt is required.' })
  }

  next()
}
