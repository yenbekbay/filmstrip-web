/* @flow */

import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { isServer, graphqlEndpoint } from '../env';

const getClient = (headers: any) => {
  if (isServer || !window.apolloClient) {
    const networkInterface = createNetworkInterface({ uri: graphqlEndpoint });

    const client = new ApolloClient({
      networkInterface,
      headers,
      ssrMode: true,
    });

    if (isServer) return client;

    window.apolloClient = client;
  }

  return window.apolloClient;
};

const resetStore = () => {
  window.apolloClient.resetStore();
};

export { resetStore };
export default getClient;
