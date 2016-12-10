/* @flow */

import React from 'react';

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
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    }}
  >
    <MovieDetails movie={movie} />
  </Modal>
);

export default MovieModal;
