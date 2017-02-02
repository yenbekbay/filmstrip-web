/* @flow */

import { css } from 'glamor';
import ProgressiveImage from 'react-progressive-image';
import React from 'react';

import { highresImageUrl, lowresImageUrl } from '../_utils';
import { t } from '../../styles';

const MovieBackdropWrapper = ({ backdropUrl, children }: {
  backdropUrl: ?string,
  // eslint-disable-next-line react/require-default-props
  children?: React$Element<any>,
}) => (
  backdropUrl ? (
    <ProgressiveImage
      src={highresImageUrl(backdropUrl)}
      placeholder={lowresImageUrl(backdropUrl)}
    >
      {(progressiveBackdropUrl: ?string) => (
        <div
          className={styles.container}
          style={progressiveBackdropUrl ? {
            backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${progressiveBackdropUrl})`,
          } : {
            backgroundColor: '#272B35',
          }}
        >
          {children}
        </div>
      )}
    </ProgressiveImage>
  ) : children
);

const styles = {
  container: css({
    ...t.h_100,
    ...t.cover,
    ...t.bg_center,
  }),
};

export default MovieBackdropWrapper;
