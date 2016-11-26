/* @flow */

import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import React, { Component } from 'react';

import { updateSearchQuery } from '../data/actions/ui';
import Loader from './Loader';
import MovieCredits from './MovieCredits';
import MovieDetails from './MovieDetails';
import MovieModal from './MovieModal';
import t from '../styles/tachyons';
import type { MovieDetailsFragment } from './types';
import type { ReduxState } from '../data/types';

type Props = {
  loading?: ?boolean,
  results?: ?Array<MovieDetailsFragment>,
  searchQuery: string,
  updateSearchQuery: (searchQuery: string) => void,
  url: {
    query: {
      id?: string,
    },
    back: () => void,
    push: (path: string) => void,
  },
};
type State = {
  searchQuery: string,
};

class Search extends Component {
  props: Props;
  state: State;
  searchInput: ?Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      searchQuery: props.searchQuery,
    };
  }

  updateSearchQuery = _.throttle(1000, (searchQuery: string) => {
    this.props.updateSearchQuery(searchQuery);
  });

  handleSearchQueryChange = (e: Object) => {
    const searchQuery = e.target.value;

    this.setState({ searchQuery });
    this.updateSearchQuery(searchQuery);
  };

  showMovieDetails = (e: Object, slug: string) => {
    e.preventDefault();
    this.props.url.push(`/movie?id=${slug}`);
  };

  render() {
    const { loading, results, url: { back, query } } = this.props;
    const modalMovie = query.id && _.find({ slug: query.id }, results);

    return (
      <div>
        {modalMovie && <MovieModal movie={modalMovie} back={back} />}
        <div className={styles.searchInputContainer}>
          <input
            autoFocus
            className={styles.searchInput}
            placeholder="Find your next movie..."
            type="text"
            onChange={this.handleSearchQueryChange}
            value={this.state.searchQuery}
          />
          <div>
            {loading && <Loader className={styles.searchInputLoader} />}
          </div>
        </div>
        <div className={styles.searchResultsContainer}>
          {_.includes(this.props.searchQuery, this.state.searchQuery) &&
            (results || []).map((movie: MovieDetailsFragment) => (
              <a
                key={movie.info.title}
                className={styles.searchResultContainer}
                href={`/movie?id=${movie.slug}`}
                onClick={(e: Object) => this.showMovieDetails(e, movie.slug)}
              >
                <img
                  className={styles.poster}
                  src={movie.info.posterUrl}
                  alt={`Poster for "${movie.info.title}"`}
                />
                <div className={styles.movieInfo}>
                  <h2 className={styles.movieTitle}>
                    {`${movie.info.title} `}
                    <span className={styles.movieYear}>
                      {`(${movie.info.releaseDate.slice(0, 4)})`}
                    </span>
                  </h2>
                  <MovieCredits credits={movie.info.credits} />
                </div>
              </a>
            ))
          }
        </div>
      </div>
    );
  }
}

const styles = {
  searchInputContainer: style({
    ...t.flex,
    ...t.flex_row,
    ...t.pb4,
    ...t.bb,
    ...t.b__white_20,
  }),
  searchInput: style({
    ...t.bg_transparent,
    ...t.outline_0,
    ...t.w_100,
    ...t.f3,
    ...t.f1_l,
    ...t.input_reset,
    ...t.bn,
    ...t.white_80,
  }),
  searchInputLoader: style({
    ...t.w2,
    ...t.h2,
  }),
  searchResultsContainer: style({
    ...t.mv4,
  }),
  searchResultContainer: style({
    ...t.db,
    ...t.flex,
    ...t.items_center,
    ...t.mv3,
  }),
  poster: style({
    ...t.db,
    ...t.h4,
  }),
  movieInfo: style({
    ...t.ml3,
    ...t.f6,
    ...t.f5_l,
  }),
  movieTitle: style({
    ...t.f4,
    ...t.f3_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb3,
  }),
  movieYear: style({
    ...t.f6,
    ...t.f5_ns,
    ...t.o_70,
  }),
};

const SEARCH_QUERY = gql`
  query SearchResults($query: String!) {
    search(query: $query) {
      ...MovieDetails
    }
  }
  ${MovieDetails.fragments.details}
`;

const withData = graphql(SEARCH_QUERY, {
  options: ({ searchQuery }: Props) => ({
    variables: {
      query: searchQuery,
    },
  }),
  props: ({ data: { loading, search } }: {
    data: {
      loading: boolean,
      search: Array<MovieDetailsFragment>,
    },
  }) => ({
    loading,
    results: search,
  }),
});

const mapStateToProps = (state: ReduxState) => ({
  searchQuery: state.ui.searchQuery,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSearchQuery: (
    searchQuery: string,
  ) => dispatch(updateSearchQuery(searchQuery)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withData(Search));
