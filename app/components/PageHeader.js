/* @flow */

import {css} from 'glamor';
import {Translator} from 'counterpart';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import Translate from 'react-translate-component';

import {isBrowser, isProduction} from '../env';
import {t} from '../styles';
import FlagIcon from './FlagIcon';
import withTranslator from '../hocs/withTranslator';
import withUrl from '../hocs/withUrl';

const PageHeader = (
  {
    showSearchModal,
    translator,
    lang,
    url,
    getPath,
  }: {
    showSearchModal(): void,
    translator: Translator,
    lang: string,
    url: {
      host: ?string,
      pathname: string,
    },
    getPath(input: {
      pathname?: string,
      query?: Object,
    }): string,
  },
) => {
  const host = isBrowser ? window.location.hostname : url.host;
  const newLang = lang === 'ru' ? 'en' : 'ru';

  const rootPath = getPath({pathname: '/'});
  const newLangPath = host && host !== '0.0.0.0' && host !== 'localhost'
    ? getPath({
        pathname: `https://${newLang}.${host.replace(`${lang}.`, '')}${url.pathname}`,
        query: {lang: null},
      })
    : getPath({query: {lang: newLang}});

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={rootPath}>
          <a className={styles.headerTitleWrapper}>
            <h1 className={styles.headerTitle}>filmstrip</h1>
          </a>
        </Link>
        <button className={styles.searchButton} onClick={showSearchModal}>
          <Translate content="ui.searchPlaceholder" />
        </button>
        <a
          className={styles.langSwitchButton}
          href={newLangPath}
          onClick={(e: Object) => {
            if (!isProduction) {
              e.preventDefault();
              Router.push(newLangPath);
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
  header: css({
    ...t.shadow_1,
    backgroundColor: '#2f343f',
  }),
  headerInner: css({
    ...t.ph3,
    ...t.ph5_ns,
    ...t.pv3,
    ...t.mw8,
    ...t.center,
    ...t.flex,
    ...t.items_center,
    ...t.flex_wrap,
  }),
  headerTitleWrapper: css({
    ...t.db,
    ...t.w_100,
    ...t.w_auto_ns,
    ...t.tc,
    ...t.ma0,
    ...t.mr3,
  }),
  headerTitle: css({
    ...t.ma0,
    ...t.f2,
    ...t.white,
  }),
  searchButton: css({
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
    ...t.pointer,
    flex: 1,
  }),
  langSwitchButton: css({
    ...t.ml3,
    ...t.bg_transparent,
    ...t.db,
    ...t.input_reset,
    ...t.button_reset,
    ...t.outline_0,
    ...t.bn,
    ...t.pa0,
    ...t.mt3,
    ...t.mt0_ns,
    height: 20,
  }),
};

export default withUrl(withTranslator(PageHeader));
