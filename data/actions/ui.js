/* @flow */

import type { FeedType, Action } from '../types';

const openTrailerModal = (youtubeId: string): Action => ({
  type: 'OPEN_TRAILER_MODAL',
  youtubeId,
});

const closeTrailerModal = (): Action => ({ type: 'CLOSE_TRAILER_MODAL' });

const switchFeedType = (feedType: FeedType): Action => ({
  type: 'SWITCH_FEED_TYPE',
  feedType,
});

export { openTrailerModal, closeTrailerModal, switchFeedType };
