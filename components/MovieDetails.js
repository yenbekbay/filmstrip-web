/* @flow */

import { style } from 'next/css';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import iso6391 from 'iso-639-1';
import React from 'react';

import breakpoints from '../styles/breakpoints';
import colors from '../styles/colors';
import MovieCredits from './MovieCredits';
import MovieRatings from './MovieRatings';
import MovieSynopsis from './MovieSynopsis';
import PeerIcon from './PeerIcon';
import PlayTrailerButton from './PlayTrailerButton';
import SeedIcon from './SeedIcon';
import t from '../styles/tachyons';
import WebtorrentNotice from './WebtorrentNotice';
import type { Torrent, MovieDetailsFragment } from './types';

const formatRuntime = (runtime: number) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
};

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December',
];
const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return `${day} ${monthNames[monthIndex]} ${year}`;
};

const MovieDetails = ({ movie }: { movie: MovieDetailsFragment }) => {
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
      youtubeIds,
    },
    torrents,
  } = movie;

  const backdropStyle = backdropUrl
    ? style({ backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${backdropUrl})` }) // eslint-disable-line max-len
    : '';
  const year = releaseDate.slice(0, 4);
  const extras = [
    [
      'Original title',
      (originalTitle && originalTitle !== title) && originalTitle,
    ],
    [
      'Original language',
      originalLanguage && iso6391.getName(originalLanguage),
    ],
    ['Rated', mpaaRating],
    ['Runtime', runtime && formatRuntime(runtime)],
    [
      'Countries',
      productionCountries && productionCountries.join(', '),
    ],
    ['Release date', releaseDate && formatDate(releaseDate)],
  ];

  return (
    <div className={styles.container}>
      <div className={`${styles.headerContainer} ${backdropStyle}`.trim()}>
        <i />
        <div className={styles.trailerButtonWrapper}>
          {youtubeIds.length > 0 && (
            <PlayTrailerButton youtubeId={youtubeIds[0]} scale={1.5} />
          )}
        </div>
        <div>
          <h1 className={styles.title}>{title}</h1>
          <h3 className={styles.subtitle}>
            {genres.join(', ')} - {year}
          </h3>
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
            <p className={styles.extras}>
              {extras.map(([label, text]: [string, mixed]) => (
                text && (
                  <span key={label}>
                    <span className={styles.extrasLabel}>{`${label}: `}</span>
                    <span className={styles.extrasText}>{text}</span>
                    <br />
                  </span>
                )
              ))}
            </p>
          </div>
          <div className={styles.torrentsContainer}>
            {_.orderBy(['size'], ['desc'], torrents).map((torrent: Torrent) => (
              <a
                key={torrent.magnetLink}
                className={styles.torrentCard}
                href={torrent.magnetLink.replace('magnet:', 'stream-magnet:')}
              >
                <div className={styles.torrentCardInner}>
                  <h4 className={styles.torrentQuality}>{torrent.quality}</h4>
                  <h5 className={styles.torrentSize}>
                    {(torrent.size / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </h5>
                  <div className={styles.torrentPeersContainer}>
                    <SeedIcon className={styles.torrentPeersIcon} scale={0.5} />
                    <span className={styles.torrentSeedsText}>
                      {torrent.seeds}
                    </span>
                    <PeerIcon className={styles.torrentPeersIcon} scale={0.5} />
                    <span className={styles.torrentPeersText}>
                      {torrent.peers}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
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
    ...t.pb4,
    flex: 1,
  }),
  ratingsWrapper: style({
    ...t.mb3,
  }),
  extras: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.lh_copy,
    ...t.mv0,
  }),
  extrasLabel: style({
    ...t.fw4,
  }),
  extrasText: style({
    ...t.fw3,
    ...t.o_70,
  }),
  torrentsContainer: style({
    ...t.flex,
    ...t.flex_wrap,
    ...t.w_100,
    ...t.pt4,
    ...t.bt,
    ...t.b__white_20,
    ...t.bw2,
  }),
  torrentsTitle: style({
    ...t.f5,
    ...t.f4_ns,
    ...t.fw5,
    ...t.mt0,
    ...t.mb3,
    ...t.o_70,
  }),
  torrentCard: style({
    ...t.dib,
    ...t.mr3,
    ...t.mb3,
    ...t.bg_white_20,
    ...t.white,
    ':hover': {
      ...t.bg_white_30,
    },
  }),
  torrentCardInner: style({
    ...t.flex,
    ...t.flex_column,
    ...t.pa3,
    ...t.tc,
  }),
  torrentQuality: style({
    ...t.f3,
    ...t.mt0,
    ...t.mb2,
  }),
  torrentSize: style({
    ...t.f4,
    ...t.fw4,
    ...t.ma0,
    ...t.mb3,
  }),
  torrentPeersContainer: style({
    whiteSpace: 'nowrap',
  }),
  torrentPeersIcon: style({
    ...t.v_mid,
  }),
  torrentSeedsText: style({
    ...t.v_mid,
    ...t.pl1,
    ...t.mr3,
  }),
  torrentPeersText: style({
    ...t.v_mid,
    ...t.pl1,
  }),
};

MovieDetails.fragments = {
  details: gql`
    fragment MovieDetails on Movie {
      ytsId
      slug
      info {
        backdropUrl
        credits {
          cast { name }
          crew { directors { name } }
        }
        genres
        imdbRating
        kpRating
        mpaaRating
        originalLanguage
        originalTitle
        posterUrl
        productionCountries
        releaseDate
        rtCriticsRating
        runtime
        synopsis
        title
        youtubeIds
      }
      torrents {
        magnetLink
        peers
        quality
        seeds
        size
      }
    }
  `,
};

export default MovieDetails;
