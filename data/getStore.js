/* @flow */

import { applyMiddleware, compose, combineReducers, createStore } from 'redux';

import uiReducer from './reducers/ui';
import { isServer, isBrowser } from '../env';

const getStore = (client: any, initialState: any) => {
  if (isServer || !window.reduxStore) {
    const universalMiddleware = applyMiddleware(client.middleware());
    const middleware = (isBrowser && window.devToolsExtension)
      ? compose(universalMiddleware, window.devToolsExtension())
      : universalMiddleware;
    const reducer = combineReducers({
      apollo: client.reducer(),
      ui: uiReducer,
    });
    const store = createStore(reducer, initialState, middleware);

    if (isServer) return store;

    window.reduxStore = store;
  }

  return window.reduxStore;
};

export default getStore;
