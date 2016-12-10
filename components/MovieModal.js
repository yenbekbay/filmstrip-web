/* @flow */

import { style } from 'next/css';
import React from 'react';

import { breakpoints } from '../styles';
import Modal from './Modal';
import MovieDetails from './MovieDetails';
import type { MovieDetailsFragment } from './types';

const MovieModal = ({ movie, back }: {
  movie: MovieDetailsFragment,
  back: () => void,
}) => (
  <Modal
    contentLabel="Movie Modal"
    isOpen
    onRequestClose={back}
    className={styles.movieModal}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    }}
  >
    <MovieDetails movie={movie} />
  </Modal>
);

const styles = {
  movieModal: style({
    top: '6rem',
    left: '1rem',
    right: '1rem',
    bottom: '1rem',
    [breakpoints.l]: {
      top: '3rem',
      left: '3rem',
      right: '3rem',
      bottom: '3rem',
    },
  }),
};

export default MovieModal;
