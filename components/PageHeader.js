/* @flow */

import { style } from 'next/css';
import { Translator } from 'counterpart';
import Link from 'next/link';
import React from 'react';
import Translate from 'react-translate-component';

import { isProduction } from '../env';
import { t } from '../styles';
import FlagIcon from './FlagIcon';
import withTranslator from '../hocs/withTranslator';
import withUrl from '../hocs/withUrl';

const PageHeader = ({ showSearchModal, translator, lang, url, getPath }: {
  showSearchModal: () => void,
  translator: Translator,
  lang: string,
  url: {
    query: Object,
    pathname: string,
    host: ?string,
    push: (path: string) => void,
  },
  getPath: (pathname: string, query?: Object) => string,
}) => {
  const rootPath = getPath('/');
  const newLang = lang === 'ru' ? 'en' : 'ru';
  const newLangPath = (
    url.host && url.host !== '0.0.0.0' && url.host !== 'localhost'
  ) ? getPath(
    `https://${newLang}.${url.host.replace(`${lang}.`, '')}${url.pathname}`,
    { ...url.query, lang: null },
  ) : getPath(url.pathname, { ...url.query, lang: newLang });

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={rootPath}>
          <a className={styles.headerTitleWrapper}>
            <h1 className={styles.headerTitle}>filmstrip</h1>
          </a>
        </Link>
        <button
          className={styles.searchButton}
          onClick={showSearchModal}
        >
          <Translate content="ui.searchPlaceholder" />
        </button>
        <a
          className={styles.langSwitchButton}
          href={newLangPath}
          onClick={(e: Object) => {
            if (!isProduction) {
              e.preventDefault();
              url.push(newLangPath);
              translator.setLocale(newLang);
            }
          }}
        >
          <FlagIcon lang={newLang} height={20} />
        </a>
      </div>
    </header>
  );
};

const styles = {
  header: style({
    ...t.shadow_1,
    backgroundColor: '#2f343f',
  }),
  headerInner: style({
    ...t.ph3,
    ...t.ph5_ns,
    ...t.pv3,
    ...t.mw8,
    ...t.center,
    ...t.flex,
    ...t.items_center,
    ...t.flex_wrap,
  }),
  headerTitleWrapper: style({
    ...t.db,
    ...t.w_100,
    ...t.w_auto_ns,
    ...t.tc,
    ...t.ma0,
    ...t.mr3,
  }),
  headerTitle: style({
    ...t.ma0,
    ...t.f2,
    ...t.white,
  }),
  searchButton: style({
    ...t.tl,
    ...t.db,
    ...t.fw3,
    ...t.mt3,
    ...t.mt0_ns,
    ...t.bg_transparent,
    ...t.f6,
    ...t.f5_l,
    ...t.white_80,
    ...t.input_reset,
    ...t.button_reset,
    ...t.pa2,
    ...t.outline_0,
    ...t.ba,
    ...t.b__white_20,
    ...t.br2,
    flex: 1,
  }),
  langSwitchButton: style({
    ...t.ml3,
    ...t.bg_transparent,
    ...t.db,
    ...t.input_reset,
    ...t.button_reset,
    ...t.outline_0,
    ...t.bn,
    ...t.pa0,
    height: 20,
  }),
};

export default withUrl(withTranslator(PageHeader));
