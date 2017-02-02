/* @flow */

import type {Action} from '../types';

const openTrailerModal = (youtubeId: string): Action => ({
  type: 'OPEN_TRAILER_MODAL',
  youtubeId,
});

const closeTrailerModal = (): Action => ({type: 'CLOSE_TRAILER_MODAL'});

const updateSearchQuery = (searchQuery: string): Action => ({
  type: 'UPDATE_SEARCH_QUERY',
  searchQuery,
});

const updateFeedGenres = (feedGenres: Array<string>): Action => ({
  type: 'UPDATE_FEED_GENRES',
  feedGenres,
});

export {
  openTrailerModal,
  closeTrailerModal,
  updateSearchQuery,
  updateFeedGenres,
};
