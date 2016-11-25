/* @flow */

const GRAPHQL_PORT = 8080;

const isServer = typeof window === 'undefined';
const isBrowser = !isServer;
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isServer
  ? undefined
  // eslint-disable-next-line max-len
  : window.location.origin || `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

module.exports = {
  isServer,
  isBrowser,
  baseUrl,
  graphqlEndpoint: isProduction && isBrowser
    ? `${window.location.protocol}//${window.location.hostname}/graphql`
    : `http://localhost:${GRAPHQL_PORT}/graphql`,
  gaTrackingID: 'UA-88023222-1',
};
