/* @flow */

import { style } from 'next/css';
import Link from 'next/link';
import React from 'react';

import { t } from '../../styles';
import type { PageInfo, FeedType } from './../types';

const FeedPagination = ({ page, activeFeedType, pageInfo }: {
  page: ?string,
  activeFeedType: FeedType,
  pageInfo: PageInfo,
}) => (
  <div className={styles.container}>
    {pageInfo.hasPreviousPage && (
      <Link
        href={(page && page > '2')
          ? `/?type=${activeFeedType}&page=${parseInt(page, 10) - 1}`
          : `/?type=${activeFeedType}`
        }
      >
        <a className={styles.link}>Previous</a>
      </Link>
    )}
    {pageInfo.hasNextPage && (
      <Link
        href={page
          ? `/?type=${activeFeedType}&page=${parseInt(page, 10) + 1}`
          : `/?type=${activeFeedType}&page=2`
        }
      >
        <a className={styles.link}>Next</a>
      </Link>
    )}
  </div>
);

const styles = {
  container: style({
    ...t.mt5,
    marginBottom: '3rem',
    ...t.mb0_ns,
    ...t.tc,
  }),
  link: style({
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
