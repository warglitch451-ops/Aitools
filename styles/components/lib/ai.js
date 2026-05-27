import OpenAI from 'openai'
import Groq from 'groq-sdk'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateWithGroq(prompt) {
  const response = await groq.chat.completions.create({
    model: 'llama3-70b-8192',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })
  return response.choices[0].message.content
}

export async function generateWithOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  })
  return response.choices[0].message.content
}

export async function generateKeywords(topic) {
  const prompt = `Generate 10 long-tail keywords with low competition for "${topic}". Return as JSON array.`
  const result = await generateWithGroq(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return result.split('\n').filter(l => l.trim())
  }
}

export async function generateYouTubeScript(topic) {
  const prompt = `Write a 60-second YouTube script for "${topic}" with hook, body, and CTA.`
  return generateWithGroq(prompt)
}
