/* @flow */

import {css} from 'glamor';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import React from 'react';

import {breakpoints, colors, t} from '../../styles';
import MovieBackdropWrapper from './MovieBackdropWrapper';
import MovieCredits from './MovieCredits';
import MovieDataRow from './MovieDataRow';
import MovieGallery from './MovieGallery';
import MoviePosterImage from './MoviePosterImage';
import MovieRatings from './MovieRatings';
import MovieSynopsis from './MovieSynopsis';
import PlayTrailerButton from './PlayTrailerButton';
import Torrents from './Torrents';
import WebtorrentNotice from '../WebtorrentNotice';
import withTranslator from '../../hocs/withTranslator';
import type {MovieDetailsFragment} from '../types';

const hoursUnit = {en: 'h', ru: 'ч'};
const minutesUnit = {en: 'min', ru: 'мин'};
const formatRuntime = (runtime: number, lang: string) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0
    ? `${hours}${hoursUnit[lang]} ${minutes}${minutesUnit[lang]}`
    : `${minutes}${minutesUnit[lang]}`;
};

const monthNames = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  ru: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
};
const formatDate = (date: string, lang: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return `${day} ${monthNames[lang][monthIndex]} ${year}`;
};

const MovieDetails = (
  {
    movie,
    lang,
  }: {
    movie: MovieDetailsFragment,
    lang: string,
  },
) => {
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
      stills,
      synopsis,
      title,
      year,
      youtubeIds,
    },
    torrents,
  } = movie;

  const extras = _.toPairs({
    'ui.originalTitleLabel': originalTitle &&
      originalTitle !== title &&
      originalTitle,
    'ui.originalLanguageLabel': originalLanguage,
    'ui.mpaaRatingLabel': mpaaRating,
    'ui.runtimeLabel': runtime && formatRuntime(runtime, lang),
    'ui.countriesLabel': productionCountries && productionCountries.join(', '),
    'ui.releaseDateLabel': releaseDate && formatDate(releaseDate, lang),
  });

  return (
    <div className={styles.container}>
      <div>
        <MovieBackdropWrapper backdropUrl={backdropUrl}>
          <div className={styles.headerContainer}>
            <div className={styles.trailerButtonWrapper}>
              {youtubeIds.length > 0 &&
                <PlayTrailerButton youtubeId={youtubeIds[0]} scale={1.5} />}
            </div>
            <div>
              <h1 className={styles.title}>{title}</h1>
              <h3 className={styles.subtitle}>{genres.join(', ')} - {year}</h3>
            </div>
          </div>
        </MovieBackdropWrapper>
      </div>
      <div className={styles.bodyContainer}>
        <WebtorrentNotice />
        <div className={styles.infoContainer}>
          <div className={styles.posterWrapper}>
            <MoviePosterImage posterUrl={posterUrl} title={title} />
          </div>
          <div className={styles.infoInner}>
            <div className={styles.ratingsWrapper}>
              <MovieRatings
                {...{imdbRating, rtCriticsRating, kpRating}}
                direction="row"
              />
            </div>
            <MovieSynopsis synopsis={synopsis} />
            <MovieCredits credits={credits} />
            <div>
              {extras.map(
                ([labelId, text]: [string, mixed]) =>
                  text &&
                  <MovieDataRow
                    key={labelId}
                    labelId={labelId}
                    text={String(text)}
                  />,
              )}
            </div>
          </div>
          {stills.length > 0 && <MovieGallery imageUrls={stills} />}
          <div className={styles.separator} />
          <Torrents torrents={torrents} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: css({
    backgroundColor: colors.bg,
  }),
  headerContainer: css({
    ...t.flex,
    ...t.flex_column,
    ...t.justify_between,
    ...t.pa3,
    ...t.pa4_l,
    ...t.tc,
    height: '18rem',
  }),
  trailerButtonWrapper: css({
    ...t.relative,
    ...t.center,
    ...t.mv4,
    width: 75,
    height: 75,
  }),
  title: css({
    ...t.f2,
    ...t.f1_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb1,
  }),
  subtitle: css({
    ...t.f5,
    ...t.f4_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.o_70,
  }),
  bodyContainer: css({
    ...t.pa3,
    ...t.pa4_l,
    ...t.mw8,
    ...t.center,
  }),
  infoContainer: css({
    ...t.flex,
    ...t.flex_wrap,
    ...t.pb4,
  }),
  posterWrapper: css({
    height: '8rem',
    width: '5rem',
    [breakpoints.l]: {
      height: '17rem',
      width: '11rem',
    },
  }),
  infoInner: css({
    ...t.pl3,
    ...t.pl4_l,
    flex: 1,
  }),
  ratingsWrapper: css({
    ...t.mb3,
  }),
  separator: css({
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
        stills
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
