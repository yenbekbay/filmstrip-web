/* @flow */

import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import Modal from 'react-modal';
import React, { Component } from 'react';

import { switchFeedType } from '../data/actions/ui';
import breakpoints from '../styles/breakpoints';
import colors from '../styles/colors';
import EntryPlaceholder from '../components/EntryPlaceholder';
import MovieDetails from '../components/MovieDetails';
import MovieFeedEntry from '../components/MovieFeedEntry';
import page from '../hocs/page';
import t from '../styles/tachyons';
import TrailerModal from '../components/TrailerModal';
import WebtorrentNotice from '../components/WebtorrentNotice';
import type { FeedType, ReduxState } from '../data/types';
import type { MovieDetailsFragment } from '../components/types';

type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
type Props = {
  loading?: ?boolean,
  movies?: ?Array<MovieDetailsFragment>,
  pageInfo: ?PageInfo,
  feedType: FeedType,
  switchFeedType: (feedType: FeedType) => void,
  url: {
    query: Object,
    pathname: string,
    back: () => void,
    push: (path: string) => void,
  },
};
type State = {
  movies: ?Array<MovieDetailsFragment>,
};

class IndexPage extends Component {
  props: Props;
  state: State;

  state = {
    movies: [],
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.movies) {
      this.setState({ movies: nextProps.movies });
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return !_.isEqual(this.props, nextProps);
  }

  dismissModal = () => {
    if (!this.props.url.query.id) return;

    this.props.url.back();
  };

  showMovieDetails = (e: Object, slug: string) => {
    e.preventDefault();
    this.props.url.push(`/movie?id=${slug}`);
  }

  render() {
    const {
      loading,
      movies = this.state.movies,
      pageInfo,
      feedType: activeFeedType,
      url,
    } = this.props;
    const modalMovie = url.query.id && _.find({ slug: url.query.id }, movies);

    return (
      <div>
        <Head>
          <title>
            {modalMovie
              ? modalMovie.info.title
              : `filmstrip feed - page ${url.query.page || 1}`
            }
          </title>
        </Head>
        {modalMovie && (
          <Modal
            isOpen
            onRequestClose={this.dismissModal}
            className={styles.movieModal}
            style={{
              overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
            onAfterOpen={() => {
              const el = document.querySelector('.ReactModal__Overlay');
              const modalEl = document.querySelector('.ReactModal__Content');

              const handler = (e: Object) => {
                const target = e.targetTouches.length > 0
                  ? e.targetTouches[0]
                  : e.target;

                if (!modalEl.contains(target)) {
                  e.preventDefault();
                  el.removeEventListener('touchend', handler);
                  this.dismissModal();
                }
              };

              el && el.addEventListener('touchend', handler);
            }}
          >
            <MovieDetails movie={modalMovie} />
          </Modal>
        )}
        <div className={styles.container}>
          <WebtorrentNotice />
          <div className={styles.feedTypeSelectorContainer}>
            {['LATEST', 'TRENDING'].map((feedType: FeedType) => (
              <button
                key={feedType}
                className={styles.feedTypeSelectorButton}
                onClick={() =>
                  activeFeedType !== feedType &&
                  this.props.switchFeedType(feedType)
                }
                {...(
                  activeFeedType === feedType
                    ? styles.feedTypeSelectorSelectedButton
                    : {}
                )}
              >
                {_.capitalize(feedType)}
              </button>
            ))}
          </div>
          {(!loading && movies && movies.length > 0) ? (
            (movies || []).map((movie: MovieDetailsFragment) => (
              <MovieFeedEntry
                key={movie.ytsId}
                movie={movie}
                showMovieDetails={this.showMovieDetails}
              />
            ))
          ) : (
            _.range(0, 3).map((idx: number) => <EntryPlaceholder key={idx} />)
          )}
          {pageInfo && (
            <div className={styles.pagination}>
              {pageInfo.hasPreviousPage && (
                <Link
                  href={(url.query.page && url.query.page > '2')
                    ? `/?page=${parseInt(url.query.page, 10) - 1}`
                    : '/'
                  }
                >
                  <a className={styles.paginationLink}>Previous</a>
                </Link>
              )}
              {pageInfo.hasNextPage && (
                <Link
                  href={url.query.page
                    ? `/?page=${parseInt(url.query.page, 10) + 1}`
                    : '/?page=2'
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

const MOVIE_FEED_QUERY = gql`
  query MovieFeed($type: FeedType!, $offset: Int, $limit: Int) {
    feed(type: $type, offset: $offset, limit: $limit) {
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

const withData = graphql(MOVIE_FEED_QUERY, {
  options: ({ url: { query }, feedType }: Props) => ({
    variables: {
      type: feedType,
      offset: query.page ? ((query.page - 1) * ITEMS_PER_PAGE) : 0,
      limit: ITEMS_PER_PAGE,
    },
  }),
  skip: ({ url: { pathname } }: Props) => pathname === '/movie',
  props: ({ data: { loading, feed } }: {
    data: {
      loading: boolean,
      feed: {
        nodes: Array<MovieDetailsFragment>,
        pageInfo: PageInfo,
      },
    },
  }) => ({
    loading,
    movies: _.get('nodes', feed),
    pageInfo: _.get('pageInfo', feed),
  }),
});

const styles = {
  container: style({
    ...t.pa3,
    ...t.pa5_ns,
    ...t.mw8,
    ...t.center,
  }),
  feedTypeSelectorContainer: style({
    ...t.tc,
    ...t.mt4,
    ...t.mt0_ns,
    ...t.mb4,
  }),
  feedTypeSelectorButton: style({
    ...t.bg_transparent,
    ...t.mh2,
    ...t.input_reset,
    ...t.button_reset,
    ...t.pa2,
    ...t.dim,
    ...t.outline_0,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
  }),
  feedTypeSelectorSelectedButton: style({
    ...t.bg_white_90,
    color: colors.bg,
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
  movieModal: style({
    ...t.absolute,
    ...t.overflow_auto,
    ...t.outline_0,
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

const mapStateToProps = (state: ReduxState) => ({
  feedType: state.ui.feedType,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  switchFeedType: (feedType: FeedType) => dispatch(switchFeedType(feedType)),
});

export default page(
  connect(mapStateToProps, mapDispatchToProps)(withData(IndexPage)),
);
