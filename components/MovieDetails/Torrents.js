/* @flow */

import { style } from 'next/css';
import _ from 'lodash/fp';
import React from 'react';
import Translate from 'react-translate-component';

import { t } from '../../styles';
import PeerIcon from './PeerIcon';
import SeedIcon from './SeedIcon';
import TorrentDataRow from './TorrentDataRow';
import type { Torrent } from './../types';

const Torrents = ({ torrents }: { torrents: Array<Torrent> }) => (
  <div className={styles.torrentsContainer}>
    {torrents.length > 0 ? _
      .orderBy(['size'], ['desc'], torrents)
      .map((torrent: Torrent) => {
        const extras = _.toPairs({
          'ui.torrentAudioTranslationTypeLabel':
            torrent.audioTranslationType &&
            torrent.audioTranslationType.toLowerCase(),
          'ui.torrentAudioTracksLabel':
            (torrent.audioTracks && torrent.audioTracks.length > 0) &&
            torrent.audioTracks.join(', '),
          'ui.torrentBundledSubtitlesLabel':
            (torrent.bundledSubtitles && torrent.bundledSubtitles.length > 0) &&
            torrent.bundledSubtitles.join(', '),
        });

        return (
          <a
            key={torrent.magnetLink}
            className={styles.torrentCard}
            href={torrent.magnetLink.replace('magnet:', 'stream-magnet:')}
          >
            <div className={styles.torrentCardInner}>
              <h4 className={styles.torrentQuality}>{torrent.quality}</h4>
              <h5 className={styles.torrentSize}>
                {`${(torrent.size / (1024 * 1024 * 1024)).toFixed(2)} `}
                <Translate content="ui.torrentGbUnit" />
              </h5>
              <div className={styles.torrentExtrasContainer}>
                {extras.map(([labelId, text]: [string, mixed]) => (
                  text && (
                    <TorrentDataRow
                      key={labelId}
                      labelId={labelId}
                      text={String(text)}
                    />
                  )
                ))}
              </div>
              <div className={styles.torrentPeersContainer}>
                <SeedIcon
                  className={styles.torrentPeersIcon}
                  scale={0.5}
                />
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
        );
      }) : (
        <Translate content="ui.torrentsPlaceholder" />
      )
    }
  </div>
);

const styles = {
  torrentsContainer: style({
    ...t.flex,
    ...t.flex_wrap,
    ...t.w_100,
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
  torrentExtrasContainer: style({
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

export default Torrents;
