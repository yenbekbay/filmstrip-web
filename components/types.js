/* @flow */

export type MovieCreditsMember = {
  name: string,
};
export type Torrent = {
  audioTracks: ?Array<string>,
  audioTranslationType: ?string,
  bundledSubtitles: ?Array<string>,
  magnetLink: string,
  peers: number,
  quality: '720p' | '1080p',
  seeds: number,
  size: number,
};
export type MovieDetailsFragment = {
  slug: string,
  info: {
    backdropUrl: ?string,
    credits: {
      cast: Array<MovieCreditsMember>,
      crew: {
        directors: Array<MovieCreditsMember>,
      },
    },
    genres: Array<string>,
    imdbRating: ?number,
    kpRating: ?number,
    mpaaRating: ?string,
    originalLanguage: ?string,
    originalTitle: ?string,
    posterUrl: ?string,
    productionCountries: Array<string>,
    releaseDate: ?string,
    rtCriticsRating: ?number,
    runtime: ?number,
    stills: Array<string>,
    synopsis: ?string,
    title: string,
    year: number,
    youtubeIds: Array<string>,
  },
  torrents: Array<Torrent>,
};

export type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};

export type FeedType = 'trending' | 'new' | 'latest';
