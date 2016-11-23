/* @flow */

import type { Action } from '../types';

export type UiState = {
  youtubeId: ?string,
};

const initialState: UiState = {
  youtubeId: null,
};

export default (
  state: UiState = initialState,
  action: Action,
): UiState => {
  switch (action.type) {
    case 'OPEN_TRAILER_MODAL':
      return {
        youtubeId: action.youtubeId,
      };
    case 'CLOSE_TRAILER_MODAL':
      return {
        youtubeId: null,
      };
    default:
      return state;
  }
};
