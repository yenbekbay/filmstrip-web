/* @flow */

import { ApolloProvider } from 'react-apollo';
import { style } from 'next/css';
import Head from 'next/head';
import Link from 'next/link';
import React, { Component } from 'react';
import 'glamor/reset'; // eslint-disable-line import/no-extraneous-dependencies

import { getClient, getStore } from '../data';
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
            </Head>
            <header className={styles.header}>
              <Link href="/">
                <h1 className={styles.headerTitle}>filmstrip</h1>
              </Link>
            </header>
            <WrappedComponent {...this.props} />
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
};

export default page;
