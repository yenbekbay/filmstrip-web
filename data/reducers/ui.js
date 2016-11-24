/* @flow */

import type { FeedType, Action } from '../types';

export type UiState = {
  youtubeId: ?string,
  feedType: FeedType,
};

const initialState: UiState = {
  youtubeId: null,
  feedType: 'LATEST',
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
    case 'SWITCH_FEED_TYPE':
      return {
        ...state,
        feedType: action.feedType,
      };
    default:
      return state;
  }
};
