/* @flow */

const GRAPHQL_PORT = 8080;

const isServer = typeof window === 'undefined';
const isBrowser = !isServer;
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isServer
  ? undefined
  // eslint-disable-next-line max-len
  : window.location.origin || `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
const hasNoTouch = isBrowser &&
  !('ontouchstart' in document.documentElement) &&
  !navigator.MaxTouchPoints &&
  // $FlowFixMe
  !navigator.msMaxTouchPoints;

module.exports = {
  isServer,
  isBrowser,
  baseUrl,
  hasNoTouch,
  graphqlEndpoint: isProduction && isBrowser
    ? `${window.location.protocol}//${window.location.hostname}/graphql`
    : `http://localhost:${GRAPHQL_PORT}/graphql`,
  apiToken: '',
};
