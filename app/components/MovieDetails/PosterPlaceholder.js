/* @flow */

import { css } from 'glamor';
import React from 'react';

import { t } from '../../styles';

const PosterPlaceholder = () => (
  <div
    className={styles.wrapper}
    style={{
      width: 90,
      height: 66,
    }}
  >
    <svg viewBox="0 0 90 66">
      <path d="M85 5v56H5V5h80m5-5H0v66h90V0z" />
      <circle cx="18" cy="20" r="6" />
      <path d="M56 14L37 39l-8-6-17 23h67z" />
    </svg>
  </div>
);

const styles = {
  wrapper: css({
    ...t.absolute,
    ...t.absolute__fill,
    fill: 'white',
    opacity: 0.7,
    margin: 'auto',
  }),
};

export default PosterPlaceholder;
