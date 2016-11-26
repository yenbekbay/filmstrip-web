/* @flow */

import type { Action } from '../types';

export type UiState = {
  youtubeId: ?string,
  searchQuery: string,
};

const initialState: UiState = {
  youtubeId: null,
  searchQuery: '',
};

export default (
  state: UiState = initialState,
  action: Action,
): UiState => {
  switch (action.type) {
    case 'OPEN_TRAILER_MODAL':
      return {
        ...state,
        youtubeId: action.youtubeId,
      };
    case 'CLOSE_TRAILER_MODAL':
      return {
        ...state,
        youtubeId: null,
      };
    case 'UPDATE_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.searchQuery,
      };
    default:
      return state;
  }
};
