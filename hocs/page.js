/* @flow */

import { ApolloProvider } from 'react-apollo';
import { style } from 'next/css';
import { Translator } from 'counterpart';
import Head from 'next/head';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import 'glamor/reset';

import { colors } from '../styles';
import { getClient, getStore, getTranslator } from '../data';
import { getDisplayName } from './_utils';
import { isBrowser, isProduction, gaTrackingID } from '../env';
import { updateSearchQuery } from '../data/actions/ui';
import Modal from '../components/Modal';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import Search from '../components/Search';
import type { WrappableComponent } from './_utils';

style.insertRule(`
  body {
    background-color: ${colors.bg};
    color: #fff;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .ReactModal__Body--open {
    overflow: hidden;
  }
`);

type GetInitialPropsContext = {
  pathname: string,
  query: Object,
  req?: ?Object,
  res?: ?Object,
};
type Props = {
  initialState: Object,
  headers: Object,
  query: Object,
  url: {
    pathname: string,
    query: {
      q?: string,
    },
    back: () => void,
    push: (path: string) => void,
  },
};
type State = {
  searching: boolean,
};

/* eslint-disable max-len */
const gaSnippet = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '${gaTrackingID}', 'auto');
`;
/* eslint-enable max-len */
const trackPageView = () => {
  if (isBrowser && isProduction && window.ga) {
    window.ga('send', 'pageview');
    window.ga('set', 'page', window.location.pathname);
  }
};

const getHostLang = (headers: Object) => {
  const { host } = headers;

  if (host && (host.startsWith('ru') || host.startsWith('en'))) {
    return host.startsWith('ru') ? 'ru' : 'en';
  }

  return null;
};
const getQueryLang = (query: Object) => {
  if (query.lang) {
    return query.lang === 'ru' ? 'ru' : 'en';
  }

  return null;
};

const page = (WrappedComponent: WrappableComponent) => {
  class Page extends Component {
    props: Props;
    apolloClient: Object;
    reduxStore: Object;
    translator: Translator;

    static displayName = `page(${getDisplayName(WrappedComponent)})`;
    static childContextTypes = {
      translator: Translate.translatorType,
      url: PropTypes.object,
    };

    static async getInitialProps(ctx: GetInitialPropsContext) {
      const headers = ctx.req ? ctx.req.headers : {};
      const apolloClient = getClient(headers);
      const reduxStore = getStore(apolloClient, {});

      return {
        initialState: reduxStore.getState(),
        headers,
      };
    }

    /* eslint-disable react/sort-comp */
    state: State = { searching: false };

    getChildContext = () => ({
      translator: this.translator,
      url: {
        ...this.props.url,
        host: this.props.headers.host,
      },
    });

    constructor(props: Props) {
      super(props);

      if (Object.keys(props).length === 0) {
        throw new Error('Props not defined');
      }

      this.apolloClient = getClient(props.headers);
      this.reduxStore = getStore(this.apolloClient, props.initialState, () => {
        if (props.url.pathname === '/') {
          this.setState({
            searching: this.reduxStore.getState().ui.searchQuery.length > 0,
          });
        } else {
          this.reduxStore.dispatch(updateSearchQuery(''));
        }
      });
      this.translator = getTranslator(
        getHostLang(props.headers) || getQueryLang(props.url.query) || 'en',
      );
    }
    /* eslint-enable react/sort-comp */

    componentDidMount() {
      trackPageView();
    }

    componentDidUpdate() {
      trackPageView();
    }

    dismissModal = () => {
      this.setState({ searching: false });
      this.reduxStore.dispatch(updateSearchQuery(''));
    };

    showSearchModal = () => {
      this.setState({ searching: true });
    };

    render() {
      /* eslint-disable max-len */
      return (
        <ApolloProvider client={this.apolloClient} store={this.reduxStore}>
          <main className={styles.wrapper}>
            <Head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="initial-scale=1.0" />
              <meta httpEquiv="Cache-Control" content="private" />

              <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png" />
              <link rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
              <link rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
              <link rel="manifest" href="/static/manifest.json" />
              <link rel="mask-icon" href="/static/safari-pinned-tab.svg" color="#2b303b" />
              <link rel="stylesheet" href="https://unpkg.com/react-select/dist/react-select.css" />

              <meta name="apple-mobile-web-app-title" content="filmstrip" />
              <meta name="application-name" content="filmstrip" />
              <meta name="theme-color" content="#ffffff" />

              <meta property="og:site_name" content="filmstrip" />
              <meta property="og:type" content="website" />

              {isBrowser && isProduction && (
                <script
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: gaSnippet }}
                />
              )}
            </Head>
            {this.state.searching && (
              <Modal
                contentLabel="Search Modal"
                isOpen
                onRequestClose={this.dismissModal}
                style={{
                  overlay: {
                    backgroundColor: 'rgba(43, 48, 59, 0.95)',
                  },
                }}
              >
                <Search url={this.props.url} />
              </Modal>
            )}
            <PageHeader showSearchModal={this.showSearchModal} />
            <WrappedComponent />
            <PageFooter />
          </main>
        </ApolloProvider>
      );
      /* eslint-enable max-len */
    }
  }

  return hoistNonReactStatics(Page, WrappedComponent, {});
};

const styles = {
  wrapper: style({
    // eslint-disable-next-line max-len
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
  }),
};

export default page;
