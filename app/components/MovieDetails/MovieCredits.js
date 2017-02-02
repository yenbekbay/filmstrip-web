/* @flow */

import React from 'react';

import MovieDataRow from './MovieDataRow';
import type {MovieCreditsMember} from '../types';

const MovieCredits = (
  {
    credits,
    truncated,
  }: {
    credits: {
      cast: Array<MovieCreditsMember>,
      crew: {
        directors: Array<MovieCreditsMember>,
      },
    },
    truncated?: boolean,
  },
) => {
  const {cast, crew: {directors}} = credits;

  return (
    <div>
      <MovieDataRow
        labelId="ui.directedByLabel"
        text={
          directors.length > 0
            ? directors.map(({name}: MovieCreditsMember) => name).join(', ')
            : '–'
        }
      />
      <MovieDataRow
        labelId="ui.castLabel"
        text={
          cast.length > 0
            ? cast
                .slice(0, truncated ? 3 : undefined)
                .map(({name}: MovieCreditsMember) => name)
                .join(', ')
            : '–'
        }
      />
    </div>
  );
};

MovieCredits.defaultProps = {
  truncated: false,
};

export default MovieCredits;
