// // OpenRouter client — all LLM calls go through here.
// const axios = require('axios');

// const BASE_URL = 'https://openrouter.ai/api/v1';

// function client() {
//   const key = process.env.OPENROUTER_API_KEY;
//   if (!key) throw new Error('OPENROUTER_API_KEY is not configured');
//   return axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       Authorization: `Bearer ${key}`,
//       'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
//       'X-Title': 'EduForge LMS',
//       'Content-Type': 'application/json',
//     },
//     timeout: 60_000,
//   });
// }

// async function chat(messages, { model, temperature = 0.7, maxTokens = 1200 } = {}) {
//   const resp = await client().post('/chat/completions', {
//     model: model || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
//     messages,
//     temperature,
//     max_tokens: maxTokens,
//   });
//   return resp.data.choices?.[0]?.message?.content ?? '';
// }

// async function embed(texts) {
//   const model = process.env.OPENROUTER_EMBED_MODEL;
//   if (!model) {
//     // Deterministic local fallback so RAG works without an embeddings model.
//     return texts.map(localHashEmbed);
//   }
//   const resp = await client().post('/embeddings', { model, input: texts });
//   return resp.data.data.map((d) => d.embedding);
// }

// // Simple bag-of-words hashing → 256-dim vector. Not as good as real embeddings
// // but works offline and is fully deterministic.
// function localHashEmbed(text) {
//   const dims = 256;
//   const v = new Array(dims).fill(0);
//   const tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
//   for (const t of tokens) {
//     let h = 2166136261;
//     for (let i = 0; i < t.length; i++) {
//       h ^= t.charCodeAt(i);
//       h = (h * 16777619) >>> 0;
//     }
//     v[h % dims] += 1;
//   }
//   // L2 normalize
//   const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
//   return v.map((x) => x / norm);
// }

// module.exports = { chat, embed };



// OpenRouter client
const axios = require('axios');

const BASE_URL = 'https://openrouter.ai/api/v1';

function client() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not configured in .env');

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'EduForge LMS',
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  });
}

async function chat(messages, { model, temperature = 0.7, maxTokens = 1200 } = {}) {
  try {
    const selectedModel = model || 
                         process.env.OPENROUTER_MODEL || 
                         'meta-llama/llama-3.1-8b-instruct';   // ← :free hataya

    console.log(`[AI] Using model: ${selectedModel}`);

    const resp = await client().post('/chat/completions', {
      model: selectedModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return resp.data.choices?.[0]?.message?.content ?? 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error("🚨 OpenRouter Error:", error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error("Selected model not available. Try another model.");
    }
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    if (error.response?.status === 401) {
      throw new Error("Invalid OpenRouter API Key");
    }

    throw new Error(error.message || 'AI service unavailable');
  }
}

async function embed(texts) {
  const model = process.env.OPENROUTER_EMBED_MODEL;
  if (!model) {
    return texts.map(localHashEmbed);
  }
  const resp = await client().post('/embeddings', { model, input: texts });
  return resp.data.data.map((d) => d.embedding);
}

function localHashEmbed(text) {
  const dims = 256;
  const v = new Array(dims).fill(0);
  const tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const t of tokens) {
    let h = 2166136261;
    for (let i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    v[h % dims] += 1;
  }
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

module.exports = { chat, embed };
