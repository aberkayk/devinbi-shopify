export const locales = ['tr', 'en', 'de', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'tr'

export const rtlLocales: Locale[] = ['ar']

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale)
}

export const shopifyLocaleMap: Record<Locale, { language: string; country: string }> = {
  tr: { language: 'TR', country: 'TR' },
  en: { language: 'EN', country: 'US' },
  de: { language: 'DE', country: 'DE' },
  ar: { language: 'AR', country: 'SA' },
}
