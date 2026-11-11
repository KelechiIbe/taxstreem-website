import type { MetadataRoute } from 'next'

// Search engines and AI answer engines are all welcome: the site is written to be found, quoted and cited.
// The AI crawlers are named one by one so that no default or shared rule ever shuts them out by accident.
const AI = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',            // OpenAI: training, ChatGPT search, live browsing
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',       // Anthropic
  'PerplexityBot', 'Perplexity-User',                   // Perplexity
  'Google-Extended', 'Gemini-Deep-Research',            // Google Gemini (Googlebot itself is covered by *)
  'bingbot',                                            // Bing, which also feeds Copilot and ChatGPT search
  'meta-externalagent', 'Meta-WebIndexer',              // Meta AI
  'Applebot', 'Applebot-Extended',                      // Apple Intelligence and Siri
  'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, { userAgent: AI, allow: '/' }],
    sitemap: 'https://www.taxstreem.com/sitemap.xml', host: 'https://www.taxstreem.com',
  }
}
