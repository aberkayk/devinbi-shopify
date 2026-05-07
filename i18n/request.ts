import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, locales, type Locale } from './config'

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base }
  for (const key in override) {
    const val = override[key]
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      result[key] = deepMerge(
        (base[key] as Record<string, unknown>) ?? {},
        val as Record<string, unknown>
      )
    } else {
      result[key] = val
    }
  }
  return result
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  const fallback = (await import(`../messages/en.json`)).default
  const localeMessages =
    locale !== 'en' ? (await import(`../messages/${locale}.json`)).default : fallback
  const messages = deepMerge(fallback, localeMessages)

  return {
    locale,
    messages,
    timeZone: 'Europe/Istanbul',
    now: new Date(),
  }
})
