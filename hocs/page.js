/* @flow */

import { ApolloProvider } from 'react-apollo';
import { style } from 'next/css';
import Head from 'next/head';
import Link from 'next/link';
import React, { Component } from 'react';
import 'glamor/reset';

import { getClient, getStore } from '../data';
import { isBrowser, isProduction, gaTrackingID } from '../env';
import colors from '../styles/colors';
import t from '../styles/tachyons';

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

const page = (
  WrappedComponent: Class<Component<any, any, any>> | (props: any) => React$Element<any>, // eslint-disable-line max-len
) => {
  class Page extends Component {
    props: Props;
    apolloClient: Object;
    reduxStore: Object;

    static async getInitialProps(ctx: GetInitialPropsContext) {
      const headers = ctx.req ? ctx.req.headers : {};
      const query = ctx.query;
      const apolloClient = getClient(headers);
      const reduxStore = getStore(apolloClient, {});
      const props = {
        initialState: reduxStore.getState(),
        headers,
        query,
      };

      if (WrappedComponent.getInitialProps) {
        const extendedCtx = { ...ctx, apolloClient, reduxStore };
        // $FlowFixMe
        const subProps = await WrappedComponent.getInitialProps(extendedCtx);

        Object.assign(props, subProps);
      }

      return props;
    }

    constructor(props: Props) {
      super(props);

      if (Object.keys(props).length === 0) {
        throw new Error('Props not defined');
      }

      this.apolloClient = getClient(props.headers);
      this.reduxStore = getStore(this.apolloClient, props.initialState);
    }

    componentDidMount() {
      trackPageView();
    }

    componentDidUpdate() {
      trackPageView();
    }

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
            <header className={styles.header}>
              <Link href="/">
                <h1 className={styles.headerTitle}>filmstrip</h1>
              </Link>
            </header>
            <WrappedComponent {...this.props} />
            <footer className={styles.footer}>
              Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.
            </footer>
          </main>
        </ApolloProvider>
      );
      /* eslint-enable max-len */
    }
  }

  return Page;
};

const styles = {
  wrapper: style({
    // eslint-disable-next-line max-len
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif',
  }),
  header: style({
    ...t.tc,
    ...t.shadow_1,
    backgroundColor: '#2f343f',
  }),
  headerTitle: style({
    ...t.db,
    ...t.f2,
    ...t.pv3,
    ...t.ma0,
    ...t.white,
  }),
  footer: style({
    ...t.tc,
    ...t.pb4,
    ...t.ph4,
    ...t.f6,
    ...t.o_70,
  }),
};

export default page;
