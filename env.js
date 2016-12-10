/* @flow */

const GRAPHQL_PORT = 8080;

const isServer = typeof window === 'undefined';
const isBrowser = !isServer;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  isServer,
  isBrowser,
  isProduction,
  graphqlEndpoint: isProduction && isBrowser
    ? `${window.location.protocol}//${window.location.hostname}/graphql`
    : `http://localhost:${GRAPHQL_PORT}/graphql`,
  gaTrackingID: 'UA-88023222-1',
};
