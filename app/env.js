/* @flow */

const GRAPHQL_PORT = 8080;

const isServer = typeof window === 'undefined';
const isBrowser = !isServer;
const isProduction = (isServer && process.env.NODE_ENV === 'production') || (
  isBrowser &&
  window.location.hostname !== '0.0.0.0' &&
  window.location.hostname !== 'localhost'
);

module.exports = {
  isServer,
  isBrowser,
  isProduction,
  graphqlEndpoint: isBrowser && isProduction
    ? `${window.location.protocol}//${window.location.hostname}/graphql`
    : `http://localhost:${GRAPHQL_PORT}/graphql`,
  gaTrackingID: 'UA-88023222-1',
};
