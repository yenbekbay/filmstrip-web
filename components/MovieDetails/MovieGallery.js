/* @flow */

import { style } from 'next/css';
import React, { Component } from 'react';

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
  state: State = {
    lightboxIsOpen: false,
    lightboxImageIndex: 0,
  };

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
          <a
            href={imageUrl}
            className={styles.thumbnail}
            key={idx}
            onClick={(e: Object) => this._openLightbox(e, idx)}
            style={idx % 4 === 0 ? {
              ...t.w_50,
            } : {
              ...t.w_25,
            }}
          >
            <img
              alt="Still from the movie"
              src={imageUrl}
              className={styles.source}
            />
          </a>
        ))}
      </div>
    );
  };

  render() {
    const { imageUrls } = this.props;
    const { lightboxIsOpen, lightboxImageIndex } = this.state;

    return (
      <div>
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
  gallery: style({
    ...t.mt4,
    ...t.flex,
    ...t.flex_wrap,
    marginRight: '-0.25rem',
    [breakpoints.l]: {
      marginRight: '-0.5rem',
    },
  }),
  thumbnail: style({
    ...t.db,
    ...t.fl,
    ...t.pr3,
    ...t.pb3,
    ...t.overflow_hidden,
    boxSizing: 'border-box',
    lineHeight: 0,
    paddingRight: '0.25rem',
    paddingBottom: '0.25rem',
    [breakpoints.l]: {
      paddingRight: '0.5rem',
      paddingBottom: '0.5rem',
    },
  }),
  source: style({
    ...t.h_100,
    ...t.w_100,
    objectFit: 'cover',
  }),
};

export default MovieGallery;
