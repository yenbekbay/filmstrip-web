/* @flow */

import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import _ from 'lodash/fp';

import uiReducer from './reducers/ui';
import { isServer, isBrowser } from '../env';

const getStore = (
  client: any,
  initialState: any,
  rehydrationCallback: void | (() => void),
) => {
  if (isServer || !window.reduxStore) {
    const universalMiddleware = applyMiddleware(client.middleware());
    const middleware = isBrowser
      ? compose(
          autoRehydrate(),
          universalMiddleware,
          window.devToolsExtension ? window.devToolsExtension() : _.identity,
        )
      : universalMiddleware;
    const reducer = combineReducers({
      apollo: client.reducer(),
      ui: uiReducer,
    });
    const store = createStore(reducer, initialState, middleware);

    if (isServer) return store;

    persistStore(store, {}, rehydrationCallback);

    window.reduxStore = store;
  }

  return window.reduxStore;
};

export default getStore;
