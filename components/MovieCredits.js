/* @flow */

import { style } from 'next/css';
import React from 'react';

import t from '../styles/tachyons';
import type { MovieCreditsMember } from './types';

const MovieCredits = ({ credits }: {
  credits: {
    cast: Array<MovieCreditsMember>,
    crew: {
      directors: Array<MovieCreditsMember>,
    },
  },
}) => {
  const { cast, crew: { directors } } = credits;

  return (
    <p className={styles.credits}>
      <span className={styles.creditsLabel}>Directed by: </span>
      <span className={styles.creditsList}>
        {directors.map(
          ({ name }: MovieCreditsMember) => name,
        ).join(', ')}
      </span>
      <br />
      <span className={styles.creditsLabel}>Cast: </span>
      <span className={styles.creditsList}>
        {cast.slice(0, 3).map(
          ({ name }: MovieCreditsMember) => name,
        ).join(', ')}
      </span>
    </p>
  );
};

const styles = {
  credits: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.lh_copy,
    ...t.mv0,
  }),
  creditsLabel: style({
    ...t.fw4,
  }),
  creditsList: style({
    ...t.fw3,
    ...t.o_70,
  }),
};

export default MovieCredits;
