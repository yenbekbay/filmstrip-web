/* @flow */

import { graphql } from 'react-apollo';
import { style } from 'next/css';
import _ from 'lodash/fp';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import Modal from 'react-modal';
import React, { Component } from 'react';

import breakpoints from '../styles/breakpoints';
import EntryPlaceholder from '../components/EntryPlaceholder';
import MovieDetails from '../components/MovieDetails';
import MovieFeedEntry from '../components/MovieFeedEntry';
import page from '../hocs/page';
import t from '../styles/tachyons';
import TrailerModal from '../components/TrailerModal';
import WebtorrentNotice from '../components/WebtorrentNotice';
import type { MovieDetailsFragment } from '../components/types';

type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
};
type Props = {
  movies: ?Array<MovieDetailsFragment>,
  pageInfo: ?PageInfo,
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
    const { movies = this.state.movies, pageInfo, url } = this.props;
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
          >
            <MovieDetails movie={modalMovie} />
          </Modal>
        )}
        <div className={styles.container}>
          <WebtorrentNotice />
          {(movies && movies.length > 0) ? (
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
  query MovieFeed($offset: Int, $limit: Int) {
    movies(offset: $offset, limit: $limit) {
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
      offset: query.page ? ((query.page - 1) * ITEMS_PER_PAGE) : 0,
      limit: ITEMS_PER_PAGE,
    },
  }),
  skip: ({ url: { pathname } }: Props) => pathname === '/movie',
  props: ({ data: { loading, movies } }: {
    data: {
      loading: boolean,
      movies: {
        nodes: Array<MovieDetailsFragment>,
        pageInfo: PageInfo,
      },
    },
  }) => ({
    loading,
    movies: _.get('nodes', movies),
    pageInfo: _.get('pageInfo', movies),
  }),
});

const styles = {
  container: style({
    ...t.pa3,
    ...t.pa5_ns,
    ...t.mw8,
    ...t.center,
  }),
  pagination: style({
    ...t.mt4,
    ...t.tc,
  }),
  paginationLink: style({
    ...t.f4,
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

export default page(withData(IndexPage));
