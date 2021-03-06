/* @flow */

import {css} from 'glamor';
import React from 'react';
import Router from 'next/router';

import {
  MovieBackdropWrapper,
  MovieCredits,
  MoviePosterImage,
  MovieRatings,
  MovieSynopsis,
  PlayTrailerButton,
} from '../MovieDetails';
import {breakpoints, t} from '../../styles';
import withUrl from '../../hocs/withUrl';
import type {MovieDetailsFragment} from '../types';

const FeedEntry = (
  {
    movie,
    getPath,
  }: {
    movie: MovieDetailsFragment,
    getPath(
      input: {
        pathname?: string,
        query?: Object,
      },
    ): string,
  },
) => {
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

  const movieDetailsPath = getPath({
    pathname: '/movie',
    query: {id: slug},
  });

  return (
    <div className={styles.container}>
      <div className={styles.posterContainer}>
        {youtubeIds.length > 0 &&
          <PlayTrailerButton youtubeId={youtubeIds[0]} />}
        <MoviePosterImage posterUrl={posterUrl} title={title} />
      </div>
      <a
        className={styles.infoContainer}
        href={movieDetailsPath}
        onClick={(e: Object) => {
          e.preventDefault();
          Router.push(
            getPath({
              pathname: '/',
              query: {movieId: slug},
            }),
            movieDetailsPath,
          );
        }}
      >
        <MovieBackdropWrapper backdropUrl={backdropUrl}>
          <div className={styles.infoInner}>
            <div className={styles.infoLeftColumn}>
              <div>
                <h1 className={styles.title}>
                  {`${title} `}
                  <span className={styles.year}>{`(${year})`}</span>
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
                {...{imdbRating, rtCriticsRating, kpRating}}
                direction="column"
              />
            </div>
          </div>
        </MovieBackdropWrapper>
      </a>
    </div>
  );
};

const styles = {
  container: css({
    ...t.br2,
    ...t.flex,
    ...t.w_100,
    ...t.overflow_hidden,
    ...t.mt2,
    [breakpoints.l]: {
      height: '17rem',
    },
  }),
  posterContainer: css({
    ...t.dn,
    ...t.db_l,
    ...t.h_100,
    ...t.relative,
    backgroundColor: '#353A44',
    width: '11rem',
  }),
  infoContainer: css({
    ...t.db,
    ...t.h_100,
    ...t.dim,
    flex: 1,
  }),
  infoInner: css({
    ...t.h_100,
    ...t.flex,
  }),
  infoLeftColumn: css({
    ...t.pa3,
    ...t.pa4_l,
    ...t.flex,
    ...t.flex_column,
    ...t.justify_between,
    flex: 1,
  }),
  infoRightColumn: css({
    ...t.bl,
    ...t.b__black_20,
    ...t.bw1,
    ...t.pa3,
  }),
  title: css({
    ...t.f4,
    ...t.f3_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb1,
  }),
  year: css({
    ...t.f6,
    ...t.f5_ns,
    ...t.o_70,
  }),
  subtitle: css({
    ...t.f6,
    ...t.f5_ns,
    ...t.fw4,
    ...t.mt0,
    ...t.mb3,
    ...t.o_70,
  }),
};

export default withUrl(FeedEntry);
