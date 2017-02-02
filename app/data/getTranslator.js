/* @flow */

import {Translator} from 'counterpart';

import {isServer} from '../env';
import translations from '../data/translations';

const getTranslator = (lang: string) => {
  if (isServer || !window.translator) {
    const translator = new Translator();
    translator.registerTranslations('en', translations.en);
    translator.registerTranslations('ru', translations.ru);
    translator.setLocale(lang);

    if (isServer) return translator;

    window.translator = translator;
  }

  return window.translator;
};

export default getTranslator;
