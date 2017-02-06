/* @flow */

import React from 'react';
import Router from 'next/router';

import Modal from './Modal';
import MovieDetails from './MovieDetails';
import withUrl from '../hocs/withUrl';
import type {MovieDetailsFragment} from './types';

const MovieModal = (
  {
    movie,
    getPath,
  }: {
    movie: MovieDetailsFragment,
    getPath(input: {
      pathname?: string,
      query?: Object,
    }): string,
  },
) => {
  const handleRequestClose = () => Router.push(
    getPath({query: {movieId: null}}),
  );

  return (
    <Modal
      contentLabel="Movie Modal"
      isOpen
      onRequestClose={handleRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <MovieDetails movie={movie} />
    </Modal>
  );
};

export default withUrl(MovieModal);
