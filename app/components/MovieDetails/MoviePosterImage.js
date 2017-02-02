/* @flow */

import { css } from 'glamor';
import React from 'react';
import ProgressiveImage from 'react-progressive-image';

import { highresImageUrl, lowresImageUrl } from '../_utils';
import { t } from '../../styles';
import PosterPlaceholder from './PosterPlaceholder';

const MoviePosterImage = ({ posterUrl, title }: {
  posterUrl: ?string,
  title: string,
}) => (
  posterUrl ? (
    <ProgressiveImage
      src={highresImageUrl(posterUrl)}
      placeholder={lowresImageUrl(posterUrl)}
    >
      {(progressivePosterUrl: ?string) => (
        progressivePosterUrl ? (
          <img
            className={styles.image}
            src={progressivePosterUrl}
            alt={`Poster for "${title}"`}
          />
        ) : <PosterPlaceholder />
      )}
    </ProgressiveImage>
  ) : <PosterPlaceholder />
);

const styles = {
  image: css({
    ...t.h_100,
    ...t.w_100,
  }),
};

export default MoviePosterImage;
