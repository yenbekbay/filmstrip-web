/* @flow */

import { style } from 'next/css';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import React from 'react';

import { colors, t } from '../../styles';
import { withTranslator } from '../../hocs';
import MovieCredits from './MovieCredits';
import MovieDataRow from './MovieDataRow';
import MovieRatings from './MovieRatings';
import MovieSynopsis from './MovieSynopsis';
import PlayTrailerButton from './PlayTrailerButton';
import Torrents from './Torrents';
import WebtorrentNotice from '../WebtorrentNotice';
import type { MovieDetailsFragment } from '../types';

const hoursUnit = { en: 'h', ru: 'ч' };
const minutesUnit = { en: 'min', ru: 'мин' };
const formatRuntime = (runtime: number, lang: string) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0
    ? `${hours}${hoursUnit[lang]} ${minutes}${minutesUnit[lang]}`
    : `${minutes}${minutesUnit[lang]}`;
};

const monthNames = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
  ],
  ru: [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля',
    'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ],
};
const formatDate = (date: string, lang: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return `${day} ${monthNames[lang][monthIndex]} ${year}`;
};

const MovieDetails = ({ movie, lang }: {
  movie: MovieDetailsFragment,
  lang: string,
}) => {
  const {
    info: {
      backdropUrl,
      credits,
      genres,
      imdbRating,
      kpRating,
      mpaaRating,
      originalLanguage,
      originalTitle,
      posterUrl,
      productionCountries,
      releaseDate,
      rtCriticsRating,
      runtime,
      synopsis,
      title,
      year,
      youtubeIds,
    },
    torrents,
  } = movie;

  const backdropStyle = backdropUrl
    ? style({ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${backdropUrl})` }) // eslint-disable-line max-len
    : '';
  const extras = _.toPairs({
    'ui.originalTitleLabel':
      (originalTitle && originalTitle !== title) && originalTitle,
    'ui.originalLanguageLabel': originalLanguage,
    'ui.mpaaRatingLabel': mpaaRating,
    'ui.runtimeLabel': runtime && formatRuntime(runtime, lang),
    'ui.countriesLabel':
      productionCountries && productionCountries.join(', '),
    'ui.releaseDateLabel': releaseDate && formatDate(releaseDate, lang),
  });

  return (
    <div className={styles.container}>
      <div className={`${styles.headerContainer} ${backdropStyle}`.trim()}>
        <div className={styles.trailerButtonWrapper}>
          {youtubeIds.length > 0 && (
            <PlayTrailerButton youtubeId={youtubeIds[0]} scale={1.5} />
          )}
        </div>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <h3 className={styles.subtitle}>{genres.join(', ')} - {year}</h3>
        </div>
      </div>
      <div className={styles.bodyContainer}>
        <WebtorrentNotice />
        <div className={styles.infoContainer}>
          <img
            className={styles.poster}
            src={posterUrl}
            alt={`Poster for "${title}"`}
          />
          <div className={styles.infoInnerWrapper}>
            <div className={styles.ratingsWrapper}>
              <MovieRatings
                {...{ imdbRating, rtCriticsRating, kpRating }}
                direction="row"
              />
            </div>
            <MovieSynopsis synopsis={synopsis} />
            <MovieCredits credits={credits} />
            <div>
              {extras.map(([labelId, text]: [string, mixed]) => (
                text && (
                  <MovieDataRow
                    key={labelId}
                    labelId={labelId}
                    text={String(text)}
                  />
                )
              ))}
            </div>
          </div>
          <div className={styles.separator} />
          <Torrents torrents={torrents} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: style({
    backgroundColor: colors.bg,
  }),
  headerContainer: style({
    ...t.db,
    ...t.cover,
    ...t.bg_center,
    ...t.white,
    ...t.pa3,
    ...t.pa4_l,
    ...t.flex,
    ...t.flex_column,
    ...t.justify_between,
    ...t.tc,
    height: '18rem',
  }),
  trailerButtonWrapper: style({
    ...t.relative,
    ...t.center,
    ...t.mv4,
    width: 75,
    height: 75,
  }),
  title: style({
    ...t.f2,
    ...t.f1_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb1,
  }),
  subtitle: style({
    ...t.f5,
    ...t.f4_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.o_70,
  }),
  bodyContainer: style({
    ...t.pa3,
    ...t.pa4_l,
    ...t.mw8,
    ...t.center,
  }),
  infoContainer: style({
    ...t.flex,
    ...t.flex_wrap,
    ...t.pb4,
  }),
  poster: style({
    ...t.db,
    ...t.h4,
    ...t.h5_ns,
  }),
  infoInnerWrapper: style({
    ...t.pl3,
    ...t.pl4_l,
    flex: 1,
  }),
  ratingsWrapper: style({
    ...t.mb3,
  }),
  separator: style({
    ...t.mv4,
    ...t.bg_white_20,
    ...t.w_100,
    height: 2,
  }),
};

MovieDetails.fragments = {
  details: gql`
    fragment MovieDetails on Movie {
      slug
      info {
        backdropUrl
        credits(lang: $lang) {
          cast { name }
          crew { directors { name } }
        }
        genres(lang: $lang)
        imdbRating
        kpRating
        mpaaRating
        originalLanguage(lang: $lang)
        originalTitle
        posterUrl(lang: $lang)
        productionCountries(lang: $lang)
        releaseDate
        rtCriticsRating
        runtime
        synopsis(lang: $lang)
        title(lang: $lang)
        year
        youtubeIds(lang: $lang)
      }
      torrents(lang: $lang) {
        audioTracks(lang: $lang)
        audioTranslationType
        bundledSubtitles(lang: $lang)
        magnetLink
        peers
        quality
        seeds
        size
      }
    }
  `,
};

export default withTranslator(MovieDetails);