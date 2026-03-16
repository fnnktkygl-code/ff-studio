import functions from '@google-cloud/functions-framework';

const MODEL = 'gemini-2.5-flash-image';
const API_KEY = process.env.VERTEX_API_KEY;

const ALLOWED_ORIGINS = [
  'https://fnnktkygl-code.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
];

function corsHeaders(req) {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
  };
}

functions.http('generate', async (req, res) => {
  const headers = corsHeaders(req);
  Object.entries(headers).forEach(([k, v]) => res.set(k, v));

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, imageDataParts } = req.body;

    if (!prompt || !imageDataParts?.length) {
      return res.status(400).json({ error: 'Missing prompt or imageDataParts' });
    }

    const url = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          ...imageDataParts,
        ],
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.error) {
      return res.status(result.error.code || 500).json({ error: result.error.message });
    }

    const base64 = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
    if (!base64) {
      return res.status(500).json({ error: 'No image generated' });
    }

    return res.json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});
