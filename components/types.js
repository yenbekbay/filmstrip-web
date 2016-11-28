/* @flow */

export type MovieCreditsMember = {
  name: string,
};
export type Torrent = {
  name?: string,
  size: number,
  seeds: number,
  peers: number,
  quality: '720p' | '1080p',
  magnetLink: string,
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
    originalLanguage: string,
    originalTitle: string,
    posterUrl: ?string,
    productionCountries: Array<string>,
    releaseDate: string,
    rtCriticsRating: ?number,
    runtime: ?number,
    synopsis: string,
    title: string,
    youtubeIds: Array<string>,
  },
  torrents: Array<Torrent>,
};
