type AiAssistant = {
  name: string
  // Referrer hostnames; subdomains match too (www.perplexity.ai → perplexity.ai)
  hosts: string[]
  // Extra utm_source values beyond the hosts themselves (compared lowercase)
  utmSources?: string[]
}

// Add new AI assistants here. The `name` is what gets sent to PostHog as `ai_source`.
const AI_SOURCES: AiAssistant[] = [
  {
    name: "ChatGPT",
    hosts: ["chatgpt.com", "chat.openai.com"],
    utmSources: ["chatgpt", "openai"],
  },
  { name: "Perplexity", hosts: ["perplexity.ai"], utmSources: ["perplexity"] },
  { name: "Claude", hosts: ["claude.ai"], utmSources: ["claude"] },
  {
    name: "Copilot",
    hosts: ["copilot.microsoft.com", "copilot.com"],
    utmSources: ["copilot"],
  },
  {
    name: "Gemini",
    hosts: ["gemini.google.com", "bard.google.com"],
    utmSources: ["gemini"],
  },
  { name: "DeepSeek", hosts: ["chat.deepseek.com"], utmSources: ["deepseek"] },
  { name: "Grok", hosts: ["grok.com"], utmSources: ["grok"] },
  { name: "Meta AI", hosts: ["meta.ai"] },
  { name: "Mistral", hosts: ["chat.mistral.ai"] },
  { name: "You.com", hosts: ["you.com"] },
  { name: "Phind", hosts: ["phind.com"] },
]

const matchesHost = (hostname: string, host: string) =>
  hostname === host || hostname.endsWith(`.${host}`)

// URL.canParse isn't available in older Safari/Chrome
const parseUrl = (value: string) => {
  try {
    return new URL(value)
  } catch {
    return undefined
  }
}

const fromReferrer = (referrer: string) => {
  const hostname = parseUrl(referrer)?.hostname
  if (!hostname) return undefined
  return AI_SOURCES.find((source) =>
    source.hosts.some((host) => matchesHost(hostname, host))
  )
}

const fromUtmSource = (url: string) => {
  const utmSource = parseUrl(url)?.searchParams.get("utm_source")?.toLowerCase()
  if (!utmSource) return undefined
  return AI_SOURCES.find(
    (source) =>
      source.hosts.includes(utmSource) || source.utmSources?.includes(utmSource)
  )
}

/**
 * Returns the name of the AI assistant that referred this visit, or null if
 * the visit didn't come from one. Checks the referrer first, then utm_source.
 */
export const detectAiSource = ({
  referrer,
  url,
}: {
  referrer: string
  url: string
}): string | null =>
  (fromReferrer(referrer) ?? fromUtmSource(url))?.name ?? null
