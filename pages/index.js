/* @flow */

import { graphql } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import cookie from 'react-cookie';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import Modal from 'react-modal';
import React, { Component } from 'react';

import breakpoints from '../styles/breakpoints';
import colors from '../styles/colors';
import EntryPlaceholder from '../components/EntryPlaceholder';
import MovieDetails from '../components/MovieDetails';
import MovieFeedEntry from '../components/MovieFeedEntry';
import page from '../hocs/page';
import t from '../styles/tachyons';
import TrailerModal from '../components/TrailerModal';
import WebtorrentNotice from '../components/WebtorrentNotice';
import type { MovieDetailsFragment } from '../components/types';

type FeedType = 'latest' | 'trending';
type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
type Props = {
  loading?: ?boolean,
  movies?: ?Array<MovieDetailsFragment>,
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
};

const defaultFeedType: FeedType = 'latest';

class IndexPage extends Component {
  props: Props;

  state: State = {
    movies: [],
  };

  componentWillMount() {
    const lastFeedType = cookie.load('lastFeedType');

    if (lastFeedType && lastFeedType !== defaultFeedType) {
      this.props.url.push(`/?type=${lastFeedType}`);
    }
  }

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
  };

  switchFeedType = (e: Object, feedType: FeedType) => {
    const activeFeedType = this.props.url.query.type || defaultFeedType;

    e.preventDefault();

    if (feedType !== activeFeedType) {
      this.props.url.push(`/?type=${feedType}`);
      cookie.save('lastFeedType', feedType, { path: '/' });
    }
  };

  render() {
    const {
      loading,
      movies = this.state.movies,
      pageInfo,
      url: { query },
    } = this.props;
    const activeFeedType = query.type || defaultFeedType;
    const modalMovie = query.id && _.find({ slug: query.id }, movies);

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
            {['latest', 'trending'].map((feedType: FeedType) => (
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
                {_.capitalize(feedType)}
              </a>
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
  feedTypeSelectorContainer: style({
    ...t.tc,
    ...t.mt4,
    ...t.mt0_ns,
    ...t.mb4,
  }),
  feedTypeSelectorLink: style({
    ...t.dib,
    ...t.mh2,
    ...t.pa2,
    ...t.dim,
    ...t.ba,
    ...t.b__white_20,
    ...t.br3,
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
  options: ({ url: { query } }: Props) => ({
    variables: {
      type: _.toUpper(query.type || defaultFeedType),
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

export default page(withData(IndexPage));
