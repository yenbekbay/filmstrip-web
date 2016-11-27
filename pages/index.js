/* @flow */

import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import cookie from 'react-cookie';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import React, { Component } from 'react';
import Select from 'react-select';

import { updateFeedGenres } from '../data/actions/ui';
import breakpoints from '../styles/breakpoints';
import colors from '../styles/colors';
import EntryPlaceholder from '../components/EntryPlaceholder';
import MovieDetails from '../components/MovieDetails';
import MovieFeedEntry from '../components/MovieFeedEntry';
import MovieModal from '../components/MovieModal';
import page from '../hocs/page';
import t from '../styles/tachyons';
import TrailerModal from '../components/TrailerModal';
import WebtorrentNotice from '../components/WebtorrentNotice';
import type { MovieDetailsFragment } from '../components/types';
import type { ReduxState } from '../data/types';

type FeedType = 'trending' | 'new' | 'latest';
type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
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
      page?: number,
      id?: string,
    },
    pathname: string,
    back: () => void,
    push: (path: string) => void,
  },
};
type State = {
  movies: ?Array<MovieDetailsFragment>,
  selectedGenres: Array<string>,
};

const defaultFeedType: FeedType = 'trending';
const feedTypeMappings = {
  trending: 'Trending',
  new: 'New',
  latest: 'Latest additions',
};

class IndexPage extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      movies: [],
      selectedGenres: props.selectedGenres || [],
    };
  }

  componentWillMount() {
    const feedType = this.props.url.query.type;
    const lastFeedType = cookie.load('lastFeedType');

    if (!feedType && lastFeedType && lastFeedType !== defaultFeedType) {
      this.props.url.push(`/?type=${lastFeedType}`);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const feedType = nextProps.url.query.type;
    const lastFeedType = cookie.load('lastFeedType');

    if (!feedType && lastFeedType && lastFeedType !== defaultFeedType) {
      this.props.url.push(`/?type=${lastFeedType}`);
    }

    if (nextProps.movies || nextProps.selectedGenres) {
      this.setState({
        movies: nextProps.movies || this.state.movies,
        selectedGenres: nextProps.selectedGenres || this.state.selectedGenres,
      });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      !_.isEqual(this.props, nextProps) ||
      !_.isEqual(this.state.selectedGenres, nextState.selectedGenres)
    );
  }

  dismissModal = () => {
    if (!this.props.url.query.id) return;

    this.props.url.back();
  };

  showMovieDetails = (e: Object, slug: string) => {
    e.preventDefault();
    this.props.url.push(`/movie?id=${slug}`);
  };

  switchFeedType = (e: Object, feedType: FeedType) => {
    const activeFeedType = this.props.url.query.type || defaultFeedType;

    e.preventDefault();

    if (feedType !== activeFeedType) {
      this.props.url.push(`/?type=${feedType}`);
      cookie.save('lastFeedType', feedType, { path: '/' });
    }
  };

  updateSelectedGenres = _.throttle(1000, (selectedGenres: Array<string>) => {
    this.props.updateSelectedGenres(selectedGenres);
  });

  handleSelectedGenresChange = (genres: Array<string>) => {
    const selectedGenres = _.map('value', genres);

    this.setState({ selectedGenres });
    this.updateSelectedGenres(selectedGenres);
  };

  render() {
    const {
      feedLoading,
      movies = this.state.movies,
      genresLoading,
      genres,
      pageInfo,
      url: { back, query },
    } = this.props;
    const activeFeedType = query.type || defaultFeedType;
    const modalMovie = query.id && _.find({ slug: query.id }, movies);
    const genreOptions = (genres || []).map((genre: string) => ({
      value: genre,
      label: genre,
    }));

    return (
      <div>
        <Head>
          <title>
            {modalMovie
              ? modalMovie.info.title
              : `filmstrip feed - page ${query.page || 1}`
            }
          </title>
        </Head>
        {modalMovie && <MovieModal movie={modalMovie} back={back} />}
        <div className={styles.container}>
          <WebtorrentNotice />
          <div className={styles.feedOptionsContainer}>
            <div className={styles.feedTypeSelectorContainer}>
              {['trending', 'new', 'latest'].map((feedType: FeedType) => (
                <a
                  key={feedType}
                  onClick={(e: Object) => this.switchFeedType(e, feedType)}
                  href={`/?type=${feedType}`}
                  className={styles.feedTypeSelectorLink}
                  style={(activeFeedType === feedType)
                    ? { ...t.bg_white_90, color: colors.bg }
                    : {}
                  }
                >
                  {feedTypeMappings[feedType]}
                </a>
              ))}
            </div>
            <Select
              multi
              instanceId="1"
              placeholder="Select genres"
              value={this.state.selectedGenres}
              isLoading={genresLoading}
              options={genreOptions}
              onChange={this.handleSelectedGenresChange}
            />
          </div>
          {(!feedLoading && feedLoading !== undefined) && (
            (movies && movies.length > 0) ? (movies || []).map(
              (movie: MovieDetailsFragment) => (
                <MovieFeedEntry
                  key={movie.slug}
                  movie={movie}
                  showMovieDetails={this.showMovieDetails}
                />
              ),
            ) : (
              <p className={styles.emptyStateText}>No movies found :(</p>
            )
          )}
          {(feedLoading || feedLoading === undefined) && (
            _.range(0, 3).map((idx: number) => <EntryPlaceholder key={idx} />)
          )}
          {pageInfo && (
            <div className={styles.pagination}>
              {pageInfo.hasPreviousPage && (
                <Link
                  href={(query.page && query.page > 2)
                    ? `/?type=${activeFeedType}&page=${parseInt(query.page, 10) - 1}` // eslint-disable-line max-len
                    : `/?type=${activeFeedType}`
                  }
                >
                  <a className={styles.paginationLink}>Previous</a>
                </Link>
              )}
              {pageInfo.hasNextPage && (
                <Link
                  href={query.page
                    ? `/?type=${activeFeedType}&page=${parseInt(query.page, 10) + 1}` // eslint-disable-line max-len
                    : `/?type=${activeFeedType}&page=2`
                  }
                >
                  <a className={styles.paginationLink}>Next</a>
                </Link>
              )}
            </div>
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
    '& > .Select': {
      width: '20rem',
      ...t.mb4,
    },
    '& .Select-control': {
      ...t.bg_transparent,
      ...t.b__white_20,
      paddingBottom: 2,
    },
    '& .Select-value, & .Select-value-icon, & .Select-value-label': {
      ...t.bg_transparent,
      ...t.b__white_20,
      ...t.white,
    },
    '& .Select-value-icon:hover, & .Select-value-icon:focus': {
      ...t.white,
      ...t.bg_white_10,
    },
    '& .Select.is-focused:not(.is-open) > .Select-control': {
      ...t.b__white,
    },
    '& .Select-menu-outer': {
      backgroundColor: colors.bg,
      ...t.b__white_20,
    },
    '& .Select-option': {
      ...t.bg_transparent,
      ...t.white,
    },
    '& .Select-option.is-focused': {
      ...t.bg_white_10,
    },
    [breakpoints.l]: {
      ...t.justify_between,
    },
  }),
  feedTypeSelectorContainer: style({
    ...t.tc,
    ...t.mv4,
    ...t.w_100,
    [breakpoints.l]: {
      ...t.mt0,
      ...t.w_auto,
    },
  }),
  feedTypeSelectorLink: style({
    ...t.dib,
    ...t.mh2,
    ...t.mv2,
    ...t.pa2,
    ...t.dim,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
  }),
  emptyStateText: style({
    ...t.f4,
    ...t.f3_l,
    ...t.db,
    ...t.tc,
    ...t.mv6,
  }),
  pagination: style({
    ...t.mt4,
    ...t.mb4,
    ...t.mb0_ns,
    ...t.tc,
  }),
  paginationLink: style({
    ...t.white,
    ...t.dim,
    ...t.pa2,
    ...t.mh2,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
  }),
};

const MOVIE_FEED_QUERY = gql`
  query MovieFeed(
    $type: FeedType!,
    $genres: [String!]!,
    $offset: Int,
    $limit: Int
  ) {
    feed(type: $type, genres: $genres, offset: $offset, limit: $limit) {
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
  options: ({ url: { query }, selectedGenres }: Props) => ({
    variables: {
      type: _.toUpper(query.type || defaultFeedType),
      genres: selectedGenres || [],
      offset: query.page ? ((query.page - 1) * ITEMS_PER_PAGE) : 0,
      limit: ITEMS_PER_PAGE,
    },
  }),
  skip: ({ url: { pathname, query } }: Props) => (
    pathname === '/movie' ||
    (!query.type && defaultFeedType !== cookie.load('lastFeedType'))
  ),
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
  query Genres { genres }
`;

const withGenres = graphql(GENRES_QUERY, {
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
  connect(mapStateToProps, mapDispatchToProps),
  withFeed,
  withGenres,
)(IndexPage);
