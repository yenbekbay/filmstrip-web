/* @flow */

import { style } from 'next/css';
import React from 'react';

import t from '../styles/tachyons';

const MovieRatings = ({ imdbRating, rtCriticsRating, kpRating, direction }: {
  imdbRating: ?number,
  rtCriticsRating: ?number,
  kpRating: ?number,
  direction: 'row' | 'column',
}) => {
  const ratingContainerStyle = style({
    ...(direction === 'row' ? t.mr3 : t.mb3),
  });

  return (
    <div
      className={styles.container}
      style={{ flexDirection: direction }}
    >
      {imdbRating && (
        <div className={ratingContainerStyle}>
          <i className={styles.ratingIcon} />
          <span className={styles.ratingText}>
            {imdbRating.toFixed(1)}
          </span>
        </div>
      )}
      {rtCriticsRating && (
        <div className={ratingContainerStyle}>
          <i
            className={styles.ratingIcon}
            style={{
              backgroundPosition: `0 -${rtCriticsRating >= 50 ? 25 : 50}px`, // eslint-disable-line max-len
            }}
          />
          <span className={styles.ratingText}>{rtCriticsRating}%</span>
        </div>
      )}
      {kpRating && (
        <div className={ratingContainerStyle}>
          <i
            className={styles.ratingIcon}
            style={{ backgroundPosition: '0 -75px' }}
          />
          <span className={styles.ratingText}>{kpRating.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: style({
    ...t.flex,
  }),
  ratingIcon: style({
    ...t.dib,
    ...t.v_mid,
    width: 25,
    height: 25,
    backgroundSize: '25px 100px',
    backgroundImage: 'url(static/rating-icons.png)',
    backgroundRepeat: 'no-repeat',
  }),
  ratingText: style({
    ...t.pl1,
    ...t.v_mid,
  }),
};

export default MovieRatings;
