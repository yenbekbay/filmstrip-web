/* @flow */

import {connect} from 'react-redux';
import {css} from 'glamor';
import {graphql, compose} from 'react-apollo';
import {Translator} from 'counterpart';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import React, {Component} from 'react';
import Router from 'next/router';

import {breakpoints, t} from '../styles';
import {updateSearchQuery} from '../data/actions/ui';
import Loader from './Loader';
import MovieDetails, {MovieCredits, MoviePosterImage} from './MovieDetails';
import withTranslator from '../hocs/withTranslator';
import withUrl from '../hocs/withUrl';
import type {MovieDetailsFragment} from './types';
import type {Dispatch, ReduxState} from '../data/types';

type Props = {
  onDismiss: () => void,
  loading?: boolean,
  results?: Array<MovieDetailsFragment>,
  searchQuery: string,
  updateSearchQuery(searchQuery: string): void,
  url: {
    query: {
      movieId?: string,
    },
  },
  getPath(
    input: {
      pathname?: string,
      query?: Object,
    },
  ): string,
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

  static defaultProps = {
    loading: false,
    results: undefined,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      searchQuery: props.searchQuery,
    };
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return !_.isEqual(this.props, nextProps) ||
      !_.isEqual(this.state, nextState);
  }

  updateSearchQuery = _.throttle(1000, (searchQuery: string) => {
    this.props.updateSearchQuery(searchQuery);
  });

  handleSearchQueryChange = (e: Object) => {
    const searchQuery = e.target.value;

    this.setState({searchQuery});
    this.updateSearchQuery(searchQuery);
  };

  showMovieDetails = (e: Object, slug: string) => {
    const {onDismiss, url, getPath} = this.props;

    const moviePagePath = `/movie?id=${slug}`;

    e.preventDefault();
    if (url.pathname === '/') {
      Router.push(getPath({query: {movieId: slug}}), moviePagePath);
    } else if (url.pathname === '/movie' && url.query.id === slug) {
      onDismiss();
    } else {
      Router.push(moviePagePath);
    }
  };

  render() {
    const {
      loading,
      results,
      searchQuery,
      translator,
    } = this.props;

    return (
      <div className={styles.container}>
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
          {results &&
            results.length > 0 &&
            _.includes(this.props.searchQuery, this.state.searchQuery)
            ? results.map((movie: MovieDetailsFragment) => (
                <a
                  key={movie.info.title}
                  className={styles.searchResultContainer}
                  href={`/movie?id=${movie.slug}`}
                  onClick={(e: Object) => this.showMovieDetails(e, movie.slug)}
                >
                  <div className={styles.posterWrapper}>
                    <MoviePosterImage
                      posterUrl={movie.info.posterUrl}
                      title={movie.info.title}
                    />
                  </div>
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
            : !loading &&
                searchQuery.length >= 3 &&
                <p className={styles.emptyStateText}>
                  {translator.translate('ui.noMoviesFoundMessage')}
                </p>}
        </div>
      </div>
    );
  }
}

const styles = {
  container: css({
    ...t.pa3,
    ...t.pa5_ns,
  }),
  searchInputContainer: css({
    ...t.flex,
    ...t.flex_row,
    ...t.pb3,
    ...t.pb4_l,
    ...t.bb,
    ...t.b__white_20,
  }),
  searchInput: css({
    ...t.bg_transparent,
    ...t.outline_0,
    ...t.w_100,
    ...t.f3,
    ...t.f1_l,
    ...t.input_reset,
    ...t.bn,
    ...t.white_80,
  }),
  searchInputLoader: css({
    ...t.w1,
    ...t.h1,
    ...t.bw2,
    [breakpoints.l]: {
      ...t.w2,
      ...t.h2,
      ...t.bw3,
    },
  }),
  searchResultsContainer: css({
    ...t.mv4,
  }),
  searchResultContainer: css({
    ...t.db,
    ...t.flex,
    ...t.items_center,
    ...t.mv3,
  }),
  posterWrapper: css({
    height: '8rem',
    width: '5rem',
  }),
  movieInfo: css({
    ...t.ml3,
    ...t.f6,
    ...t.f5_l,
    flex: 1,
  }),
  movieTitle: css({
    ...t.f4,
    ...t.f3_ns,
    ...t.fw4,
    ...t.mv0,
    ...t.mb3,
  }),
  movieYear: css({
    ...t.f6,
    ...t.f5_ns,
    ...t.o_70,
  }),
  emptyStateText: css({
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
  options: ({searchQuery, lang}: Props) => ({
    variables: {
      query: searchQuery,
      lang: lang.toUpperCase(),
    },
  }),
  props: (
    {
      data: {loading, search},
    }: {
      data: {
        loading: boolean,
        search: Array<MovieDetailsFragment>,
      },
    },
  ) => ({
    loading,
    results: search,
  }),
});

const mapStateToProps = (state: ReduxState) => ({
  searchQuery: state.ui.searchQuery,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSearchQuery: (searchQuery: string) =>
    dispatch(updateSearchQuery(searchQuery)),
});

export default compose(
  withUrl,
  withTranslator,
  connect(mapStateToProps, mapDispatchToProps),
  withResults,
)(Search);
