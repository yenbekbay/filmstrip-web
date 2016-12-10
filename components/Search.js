/* @flow */

import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { style } from 'next/css';
import { Translator } from 'counterpart';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import React, { Component } from 'react';

import { breakpoints, t } from '../styles';
import { updateSearchQuery } from '../data/actions/ui';
import Loader from './Loader';
import MovieDetails, { MovieCredits } from './MovieDetails';
import MovieModal from './MovieModal';
import withTranslator from '../hocs/withTranslator';
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
  translator: Translator,
  lang: string,
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
    const {
      loading,
      results,
      searchQuery,
      url: { back, query },
      translator,
  } = this.props;
    const modalMovie = query.id && _.find({ slug: query.id }, results);

    return (
      <div>
        {modalMovie && <MovieModal movie={modalMovie} back={back} />}
        <div className={styles.searchInputContainer}>
          <input
            autoFocus
            className={styles.searchInput}
            placeholder={translator.translate('ui.searchPlaceholder')}
            type="text"
            onChange={this.handleSearchQueryChange}
            value={this.state.searchQuery}
          />
          <div>
            {loading && <Loader className={styles.searchInputLoader} />}
          </div>
        </div>
        <div className={styles.searchResultsContainer}>
          {(
            results && results.length > 0 &&
            _.includes(this.props.searchQuery, this.state.searchQuery)
          ) ? (
            results.map((movie: MovieDetailsFragment) => (
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
                      {`(${movie.info.year})`}
                    </span>
                  </h2>
                  <MovieCredits credits={movie.info.credits} truncated />
                </div>
              </a>
            ))
          ) : (
            (!loading && searchQuery.length >= 3) && (
              <p className={styles.emptyStateText}>No movies found :(</p>
            )
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  searchInputContainer: style({
    ...t.flex,
    ...t.flex_row,
    ...t.pb3,
    ...t.pb4_l,
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
    ...t.w1,
    ...t.h1,
    ...t.bw2,
    [breakpoints.l]: {
      ...t.w2,
      ...t.h2,
      ...t.bw3,
    },
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
  emptyStateText: style({
    ...t.f4,
    ...t.f3_l,
    ...t.db,
    ...t.mv4,
  }),
};

const SEARCH_QUERY = gql`
  query SearchResults($query: String!, $lang: Language!) {
    search(query: $query, lang: $lang) {
      ...MovieDetails
    }
  }
  ${MovieDetails.fragments.details}
`;

const withResults = graphql(SEARCH_QUERY, {
  options: ({ searchQuery, lang }: Props) => ({
    variables: {
      query: searchQuery,
      lang: lang.toUpperCase(),
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

export default compose(
  withTranslator,
  connect(mapStateToProps, mapDispatchToProps),
  withResults,
)(Search);
