/* @flow */

import { style } from 'next/css';
import _ from 'lodash/fp';
import ProgressiveImage from 'react-progressive-image';
import React, { Component } from 'react';

import { highresImageUrl, lowresImageUrl } from '../_utils';
import { breakpoints, t } from '../../styles';
import Lightbox from './Lightbox';

type Props = {
  imageUrls: Array<string>,
};
type State = {
  lightboxIsOpen: boolean,
  lightboxImageIndex: number,
};

class MovieGallery extends Component {
  props: Props;

  /* eslint-disable react/sort-comp */
  state: State = {
    lightboxIsOpen: false,
    lightboxImageIndex: 0,
  };
  imageWidthMappings: Array<number> = _.flow(_.shuffle, _.flatten)([
    _.shuffle([50, 25, 25]),
    _.shuffle([20, 50, 30]),
  ]);

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !_.isEqual(this.props, nextProps) ||
      !_.isEqual(this.state, nextState);
  }
  /* eslint-enable react/sort-comp */

  _openLightbox = (e: Object, idx: number) => {
    e.preventDefault();
    this.setState({
      lightboxIsOpen: true,
      lightboxImageIndex: idx,
    });
  };

  _closeLightbox = () => {
    this.setState({
      lightboxIsOpen: false,
      lightboxImageIndex: 0,
    });
  };

  _renderGallery = () => {
    const { imageUrls } = this.props;

    return (
      <div className={styles.gallery}>
        {imageUrls.slice(0, 6).map((imageUrl: string, idx: number) => (
          <ProgressiveImage
            src={highresImageUrl(imageUrl)}
            placeholder={lowresImageUrl(imageUrl)}
          >
            {(progressiveImageUrl: string) => (
              <button
                href={imageUrl}
                className={styles.thumbnail}
                key={idx}
                onClick={(e: Object) => this._openLightbox(e, idx)}
                style={{
                  width: `${this.imageWidthMappings[idx]}%`,
                  backgroundImage: `url(${progressiveImageUrl})`,
                }}
              />
            )}
          </ProgressiveImage>
        ))}
      </div>
    );
  };

  render() {
    const { imageUrls } = this.props;
    const { lightboxIsOpen, lightboxImageIndex } = this.state;

    return (
      <div className={styles.container}>
        {this._renderGallery()}
        {lightboxIsOpen && (
          <Lightbox
            imageUrls={imageUrls}
            startIndex={lightboxImageIndex}
            onCloseRequest={this._closeLightbox}
          />
        )}
      </div>
    );
  }
}

const styles = {
  container: style({
    ...t.mt4,
    ...t.w_100,
  }),
  gallery: style({
    ...t.flex,
    ...t.flex_wrap,
    marginRight: '-0.25rem',
    marginBottom: '-0.25rem',
    [breakpoints.l]: {
      marginRight: '-0.5rem',
      marginBottom: '-0.25rem',
    },
  }),
  thumbnail: style({
    ...t.pa0,
    ...t.input_reset,
    ...t.button_reset,
    ...t.bg_transparent,
    ...t.outline_0,
    ...t.bn,
    ...t.dim,
    ...t.cover,
    ...t.bg_center,
    height: '25vw',
    backgroundClip: 'content-box',
    paddingRight: '0.25rem',
    paddingBottom: '0.25rem',
    [breakpoints.l]: {
      paddingRight: '0.5rem',
      paddingBottom: '0.5rem',
    },
  }),
};

export default MovieGallery;
