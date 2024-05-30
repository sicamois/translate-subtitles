import 'server-only';

// let dictionariesMap = new Map<SuppportedLocale, Promise<any>>();

// supportedLocales.forEach((locale) => {
//   dictionariesMap.set(
//     locale,
//     import(`@/dictionaries/${locale}.json`).then((module) => module.default)
//   );
// });

// const dictionaries = Object.fromEntries(dictionariesMap.entries());

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
};

export const supportedLocales = Object.keys(dictionaries);

export type SuppportedLocale = keyof typeof dictionaries;
export type LabelsDictionary = Record<string, Record<string, string>>;

export const getDictionary = async (locale?: SuppportedLocale) => {
  // @ts-expect-error : we will be typing this later...
  return dictionaries[locale ?? 'en']() as LabelsDictionary;
};
