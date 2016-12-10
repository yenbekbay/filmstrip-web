/* @flow */

import { style } from 'next/css';
import React from 'react';
import Translate from 'react-translate-component';

import { t } from '../../styles';

const MovieDataRow = ({ labelId, text }: {
  labelId: string,
  text: string,
}) => (
  <p className={styles.rowContainer}>
    <Translate content={labelId} className={styles.rowLabel} />
    <span className={styles.rowText}>{text}</span>
  </p>
);

const styles = {
  rowContainer: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.lh_copy,
    ...t.mv0,
  }),
  rowLabel: style({
    ...t.fw4,
  }),
  rowText: style({
    ...t.fw3,
    ...t.o_70,
  }),
};

export default MovieDataRow;
