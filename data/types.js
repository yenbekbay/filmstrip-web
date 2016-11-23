/* @flow */

import type { UiState } from './reducers/ui';

export type Action =
  // UI
  | { type: 'OPEN_TRAILER_MODAL', youtubeId: string }
  | { type: 'CLOSE_TRAILER_MODAL' };

export type Dispatch = (action: Action) => void;
export type ReduxState = {
  ui: UiState,
};
