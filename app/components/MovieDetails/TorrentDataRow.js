/* @flow */

import {css} from 'glamor';
import React from 'react';
import Translate from 'react-translate-component';

import {t} from '../../styles';

const TorrentDataRow = (
  {
    labelId,
    text,
  }: {
    labelId: string,
    text: string,
  },
) => (
  <p className={styles.rowContainer}>
    <Translate content={labelId} className={styles.rowLabel} />
    <span className={styles.rowText}>{text}</span>
  </p>
);

const styles = {
  rowContainer: css({
    ...t.f6,
    ...t.f5_ns,
    ...t.lh_copy,
    ...t.mv0,
  }),
  rowLabel: css({
    ...t.fw4,
  }),
  rowText: css({
    ...t.fw3,
    ...t.o_70,
  }),
};

export default TorrentDataRow;
