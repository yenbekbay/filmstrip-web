/* @flow */

import {css} from 'glamor';
import {Translator} from 'counterpart';
import cookie from 'react-cookie';
import React from 'react';
import Router from 'next/router';

import {breakpoints, colors, t} from '../../styles';
import withTranslator from '../../hocs/withTranslator';
import withUrl from '../../hocs/withUrl';
import type {FeedType} from '../types';

const FeedTypeSelector = (
  {
    activeFeedType,
    translator,
    getPath,
  }: {
    activeFeedType: FeedType,
    translator: Translator,
    getPath(
      input: {
        pathname?: string,
        query?: Object,
      },
    ): string,
  },
) => {
  const feedTypeMappings = {
    trending: translator.translate('ui.trendingFeedType'),
    new: translator.translate('ui.newFeedType'),
    latest: translator.translate('ui.latestFeedType'),
  };

  return (
    <div className={styles.container}>
      {['trending', 'new', 'latest'].map((feedType: FeedType) => {
        const feedTypePath = getPath({
          pathname: '/',
          query: {type: feedType},
        });

        return (
          <a
            key={feedType}
            onClick={(e: Object) => {
              e.preventDefault();
              if (activeFeedType !== feedType) {
                Router.push(feedTypePath);
                cookie.save('lastFeedType', feedType, {path: '/'});
              }
            }}
            href={feedTypePath}
            className={styles.link}
            style={
              activeFeedType === feedType
                ? {...t.bg_white_90, color: colors.bg}
                : {}
            }
          >
            {feedTypeMappings[feedType]}
          </a>
        );
      })}
    </div>
  );
};

const styles = {
  container: css({
    ...t.tc,
    ...t.mb3,
    ...t.w_100,
    [breakpoints.l]: {
      ...t.mb0,
      ...t.w_auto,
    },
  }),
  link: css({
    ...t.dib,
    ...t.ma2,
    ...t.pa2,
    ...t.dim,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
  }),
};

export default withUrl(withTranslator(FeedTypeSelector));
