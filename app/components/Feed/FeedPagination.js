/* @flow */

import {css} from 'glamor';
import Link from 'next/link';
import React from 'react';
import Translate from 'react-translate-component';

import {t} from '../../styles';
import type {PageInfo, FeedType} from './../types';

const FeedPagination = (
  {
    page,
    activeFeedType,
    pageInfo,
  }: {
    page: ?string,
    activeFeedType: FeedType,
    pageInfo: PageInfo,
  },
) => (
  <div className={styles.container}>
    {pageInfo.hasPreviousPage &&
      <Link
        href={
          page && page > '2'
            ? `/?type=${activeFeedType}&page=${parseInt(page, 10) - 1}`
            : `/?type=${activeFeedType}`
        }
      >
        <a className={styles.link}>
          <Translate content="ui.previousPageLabel" />
        </a>
      </Link>}
    {pageInfo.hasNextPage &&
      <Link
        href={
          page
            ? `/?type=${activeFeedType}&page=${parseInt(page, 10) + 1}`
            : `/?type=${activeFeedType}&page=2`
        }
      >
        <a className={styles.link}>
          <Translate content="ui.nextPageLabel" />
        </a>
      </Link>}
  </div>
);

const styles = {
  container: css({
    marginTop: '3rem',
    marginBottom: '3rem',
    ...t.mb0_ns,
    ...t.tc,
  }),
  link: css({
    ...t.dib,
    ...t.white,
    ...t.dim,
    ...t.pa2,
    ...t.mh2,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
  }),
};

export default FeedPagination;
