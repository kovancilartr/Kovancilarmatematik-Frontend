import "server-only";
import type { Locale } from "@/i18n";

const dictionaries = {
  tr: () => import("@/dictionaries/tr.json").then((module) => module.default),
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
} as const;

export async function getDictionary(locale: Locale) {
  const dictLoader = dictionaries[locale] ?? dictionaries.tr;
  return dictLoader();
}
