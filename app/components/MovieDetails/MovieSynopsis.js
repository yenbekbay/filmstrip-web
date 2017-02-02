/* @flow */

import {css} from 'glamor';
import _ from 'lodash/fp';
import React from 'react';

import {t} from '../../styles';

const MovieSynopsis = (
  {
    synopsis,
    truncated,
  }: {
    synopsis?: ?string,
    truncated?: boolean,
  },
) => (
  <p className={styles.synopsis}>
    {(truncated ? _.truncate({length: 180}, synopsis) : synopsis) || '–'}
  </p>
);

MovieSynopsis.defaultProps = {
  synopsis: null,
  truncated: false,
};

const styles = {
  synopsis: css({
    ...t.f6,
    ...t.f5_ns,
    ...t.fw3,
    ...t.lh_copy,
    ...t.mt0,
    ...t.mb3,
  }),
};

export default MovieSynopsis;
