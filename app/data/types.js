/* @flow */

import type {UiState} from './reducers/ui';

export type Action =  // ui
  | {type: 'OPEN_TRAILER_MODAL', youtubeId: string}
  | {type: 'CLOSE_TRAILER_MODAL'}
  | {type: 'UPDATE_SEARCH_QUERY', searchQuery: string}
  | {type: 'UPDATE_FEED_GENRES', feedGenres: Array<string>};
export type Dispatch = (action: Action) => void;
export type ReduxState = {
  ui: UiState,
};
