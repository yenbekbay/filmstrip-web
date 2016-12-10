/* @flow */

import { style } from 'next/css';
import _ from 'lodash/fp';
import React from 'react';

import t from '../styles/tachyons';

const MovieSynopsis = ({ synopsis, truncated }: {
  synopsis?: ?string,
  truncated?: boolean,
}) => (
  <p className={styles.synopsis}>
    {(truncated ? _.truncate({ length: 180 }, synopsis) : synopsis) || '–'}
  </p>
);

const styles = {
  synopsis: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.fw3,
    ...t.lh_copy,
    ...t.mt0,
    ...t.mb3,
  }),
};

export default MovieSynopsis;
