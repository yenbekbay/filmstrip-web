/* @flow */

import { style } from 'next/css';
import React from 'react';

import breakpoints from '../styles/breakpoints';
import MovieCredits from './MovieCredits';
import MovieRatings from './MovieRatings';
import MovieSynopsis from './MovieSynopsis';
import PlayTrailerButton from './PlayTrailerButton';
import t from '../styles/tachyons';
import withUrl from '../hocs/withUrl';
import type { MovieDetailsFragment } from './types';

const FeedEntry = ({ movie, url, getPath }: {
  movie: MovieDetailsFragment,
  url: { push: (path: string) => void },
  getPath: (pathname: string, query?: Object) => string,
}) => {
  const {
    slug,
    info: {
      backdropUrl,
      credits,
      genres,
      imdbRating,
      kpRating,
      posterUrl,
      rtCriticsRating,
      synopsis,
      title,
      year,
      youtubeIds,
    },
  } = movie;

  const movieDetailsPath = getPath('/movie', { id: slug });
  const backdropStyle = backdropUrl
    ? style({ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${backdropUrl})` }) // eslint-disable-line max-len
    : '';

  return (
    <div className={styles.container}>
      <div className={styles.posterContainer}>
        {youtubeIds.length > 0 && (
          <PlayTrailerButton youtubeId={youtubeIds[0]} />
        )}
        <img
          className={styles.poster}
          src={posterUrl}
          alt={`Poster for "${title}"`}
        />
      </div>
      <a
        className={`${styles.infoContainer} ${backdropStyle}`.trim()}
        href={movieDetailsPath}
        onClick={(e: Object) => {
          e.preventDefault();
          url.push(movieDetailsPath);
        }}
      >
        <div className={styles.infoLeftColumn}>
          <div>
            <h1 className={styles.title}>
              {`${title} `}<span className={styles.year}>{`(${year})`}</span>
            </h1>
            <h3 className={styles.subtitle}>
              {genres.join(', ')}
            </h3>
          </div>
          <MovieSynopsis synopsis={synopsis} truncated />
          <MovieCredits credits={credits} truncated />
        </div>
        <div className={styles.infoRightColumn}>
          <MovieRatings
            {...{ imdbRating, rtCriticsRating, kpRating }}
            direction="column"
          />
        </div>
      </a>
    </div>
  );
};

const styles = {
  container: style({
    ...t.br2,
    ...t.flex,
    ...t.w_100,
    ...t.overflow_hidden,
    ...t.mt2,
    [breakpoints.l]: {
      height: '17rem',
    },
  }),
  posterContainer: style({
    ...t.dn,
    ...t.db_l,
    ...t.h_100,
    ...t.relative,
    width: '11rem',
  }),
  poster: style({
    ...t.h_100,
    ...t.w_100,
  }),
  infoContainer: style({
    ...t.db,
    ...t.dim,
    ...t.cover,
    ...t.bg_center,
    ...t.white,
    ...t.flex,
    flex: 1,
  }),
  infoLeftColumn: style({
    ...t.pa3,
    ...t.pa4_l,
    ...t.flex,
    ...t.flex_column,
    ...t.justify_between,
    flex: 1,
  }),
  infoRightColumn: style({
    ...t.bl,
    ...t.b__black_20,
    ...t.bw1,
    ...t.pa3,
  }),
  title: style({
    ...t.f4,
    ...t.f3_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb1,
  }),
  year: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.o_70,
  }),
  subtitle: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.fw4,
    ...t.mt0,
    ...t.mb3,
    ...t.o_70,
  }),
};

export default withUrl(FeedEntry);
