/* @flow */

import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import cookie from 'react-cookie';
import gql from 'graphql-tag';
import Head from 'next/head';
import React, { Component } from 'react';

import {
  FeedEntry,
  FeedEntryPlaceholder,
  FeedGenresSelector,
  FeedPagination,
  FeedTypeSelector,
} from '../components/Feed';
import { t } from '../styles';
import { updateFeedGenres } from '../data/actions/ui';
import MovieDetails from '../components/MovieDetails';
import MovieModal from '../components/MovieModal';
import page from '../hocs/page';
import TrailerModal from '../components/TrailerModal';
import WebtorrentNotice from '../components/WebtorrentNotice';
import withTranslator from '../hocs/withTranslator';
import withUrl from '../hocs/withUrl';
import type {
  MovieDetailsFragment,
  PageInfo,
  FeedType,
} from '../components/types';
import type { ReduxState } from '../data/types';

type Props = {
  feedLoading?: ?boolean,
  movies?: ?Array<MovieDetailsFragment>,
  genresLoading?: ?boolean,
  genres?: ?Array<string>,
  selectedGenres: ?Array<string>,
  updateSelectedGenres: (genres: Array<string>) => void,
  pageInfo?: ?PageInfo,
  url: {
    query: {
      type?: FeedType,
      page?: string,
      id?: string,
    },
    pathname: string,
    back: () => void,
    push: (path: string) => void,
  },
  getPath: (pathname: string, query?: Object) => string,
  lang: string,
};
type State = {
  movies: ?Array<MovieDetailsFragment>,
};

const defaultFeedType: FeedType = 'trending';

class IndexPage extends Component {
  props: Props;

  state: State = {
    movies: [],
  };

  componentWillMount() {
    const { url, getPath } = this.props;
    const feedType = url.query.type;
    const lastFeedType = cookie.load('lastFeedType');

    if (!feedType && lastFeedType && lastFeedType !== defaultFeedType) {
      url.push(getPath('/', { type: lastFeedType }));
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (_.isEqual(nextProps, this.props)) return;

    const { movies, selectedGenres, url, getPath } = nextProps;
    const feedType = url.query.type;
    const isOnHomePage = url.pathname === '/';
    const lastFeedType = cookie.load('lastFeedType');

    if (
      !feedType && isOnHomePage &&
      lastFeedType && lastFeedType !== defaultFeedType
    ) {
      this.props.url.push(getPath('/', { type: lastFeedType }));
    }

    if (movies || selectedGenres) {
      this.setState({
        movies: movies || this.state.movies,
      });
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return !_.isEqual(this.props, nextProps);
  }

  _dismissModal = () => {
    if (!this.props.url.query.id) return;

    this.props.url.back();
  };

  _handleSelectedGenresChange = _.throttle(
    1000, this.props.updateSelectedGenres,
  );

  render() {
    const {
      feedLoading,
      movies = this.state.movies,
      genresLoading,
      genres,
      selectedGenres,
      pageInfo,
      url: { back, query },
    } = this.props;
    const activeFeedType = query.type || defaultFeedType;
    const modalMovie = query.id && _.find({ slug: query.id }, movies);

    return (
      <div>
        <Head>
          <title>
            {modalMovie
              ? modalMovie.info.title
              : `filmstrip feed${query.page ? ` - page ${query.page}` : ''}`
            }
          </title>
        </Head>
        {modalMovie && <MovieModal movie={modalMovie} back={back} />}
        <div className={styles.container}>
          <WebtorrentNotice />
          <div className={styles.feedOptionsContainer}>
            <FeedTypeSelector activeFeedType={activeFeedType} />
            <FeedGenresSelector
              genres={genres}
              selectedGenres={selectedGenres || []}
              loading={genresLoading}
              onSelectedGenresChange={this._handleSelectedGenresChange}
            />
          </div>
          {!feedLoading && (
            (movies && movies.length > 0) ? (movies || []).map(
              (movie: MovieDetailsFragment) => (
                <FeedEntry key={movie.slug} movie={movie} />
              ),
            ) : (
              <p className={styles.emptyStateText}>No movies found :(</p>
            )
          )}
          {feedLoading && (
            _.range(0, 3).map((idx: number) => (
              <FeedEntryPlaceholder key={idx} />
            ))
          )}
          {pageInfo && (
            <FeedPagination
              page={query.page}
              activeFeedType={activeFeedType}
              pageInfo={pageInfo}
            />
          )}
        </div>
        <TrailerModal />
      </div>
    );
  }
}

const styles = {
  container: style({
    ...t.pa3,
    ...t.pa5_ns,
    ...t.mw8,
    ...t.center,
  }),
  feedOptionsContainer: style({
    ...t.flex,
    ...t.flex_wrap,
    ...t.items_center,
    ...t.justify_center,
    ...t.mb5,
    ...t.justify_between_l,
    ...t.mt0_ns,
    marginTop: '3rem',
  }),
  emptyStateText: style({
    ...t.f4,
    ...t.f3_l,
    ...t.db,
    ...t.tc,
    ...t.mv6,
  }),
};

const MOVIE_FEED_QUERY = gql`
  query MovieFeed(
    $type: FeedType!,
    $lang: Language!,
    $genres: [String!]!,
    $offset: Int,
    $limit: Int
  ) {
    feed(
      type: $type,
      lang: $lang,
      genres: $genres,
      offset: $offset,
      limit: $limit
    ) {
      nodes {
        ...MovieDetails
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
      }
    }
  }
  ${MovieDetails.fragments.details}
`;
const ITEMS_PER_PAGE = 10;

const withFeed = graphql(MOVIE_FEED_QUERY, {
  options: ({ url: { query }, selectedGenres, lang }: Props) => ({
    variables: {
      type: (query.type || defaultFeedType).toUpperCase(),
      lang: lang.toUpperCase(),
      genres: selectedGenres || [],
      offset: query.page
        ? ((parseInt(query.page, 10) - 1) * ITEMS_PER_PAGE)
        : 0,
      limit: ITEMS_PER_PAGE,
    },
  }),
  skip: ({ url: { pathname, query } }: Props) => {
    const lastFeedType = cookie.load('lastFeedType');

    return (
      pathname === '/movie' ||
      (!query.type && lastFeedType && lastFeedType !== defaultFeedType)
    );
  },
  props: ({ data: { loading, feed } }: {
    data: {
      loading: boolean,
      feed: {
        nodes: Array<MovieDetailsFragment>,
        pageInfo: PageInfo,
      },
    },
  }) => ({
    feedLoading: loading,
    movies: _.get('nodes', feed),
    pageInfo: _.get('pageInfo', feed),
  }),
});

const GENRES_QUERY = gql`
  query Genres($lang: Language!) { genres(lang: $lang) }
`;

const withGenres = graphql(GENRES_QUERY, {
  options: ({ lang }: Props) => ({
    variables: {
      lang: lang.toUpperCase(),
    },
  }),
  props: ({ data: { loading, genres } }: {
    data: {
      loading: boolean,
      genres: Array<string>,
    },
  }) => ({
    genresLoading: loading,
    genres,
  }),
});

const mapStateToProps = (state: ReduxState) => ({
  selectedGenres: state.ui.feedGenres,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateSelectedGenres: (genres: Array<string>) =>
    dispatch(updateFeedGenres(genres)),
});

export default compose(
  page,
  withUrl,
  withTranslator,
  connect(mapStateToProps, mapDispatchToProps),
  withFeed,
  withGenres,
)(IndexPage);
