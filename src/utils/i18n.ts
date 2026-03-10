import path from 'path';
import { getGuildLanguage } from './config';
import { SupportedLang } from '../types';

const locales: Record<SupportedLang, Record<string, unknown>> = {
  es: require(path.join(__dirname, '..', '..', 'locales', 'es.json')),
  en: require(path.join(__dirname, '..', '..', 'locales', 'en.json')),
};

export const supportedLangs: SupportedLang[] = ['es', 'en'];

export async function t(guildId: string, key: string, vars: Record<string, string> = {}): Promise<string> {
  const langRaw = await getGuildLanguage(guildId);
  const lang: SupportedLang = supportedLangs.includes(langRaw as SupportedLang)
    ? (langRaw as SupportedLang)
    : 'es';

  const keys = key.split('.');
  let value: unknown = locales[lang];
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
  }

  if (typeof value !== 'string') return key;

  return value.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}
