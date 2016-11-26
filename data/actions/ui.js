/* @flow */

import type { Action } from '../types';

const openTrailerModal = (youtubeId: string): Action => ({
  type: 'OPEN_TRAILER_MODAL',
  youtubeId,
});

const closeTrailerModal = (): Action => ({ type: 'CLOSE_TRAILER_MODAL' });

export { openTrailerModal, closeTrailerModal };
