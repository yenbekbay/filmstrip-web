/* @flow */

import { connect } from 'react-redux';
import { style } from 'next/css';
import React from 'react';
import YouTube from 'react-youtube';

import { closeTrailerModal } from '../data/actions/ui';
import breakpoints from '../styles/breakpoints';
import Modal from './Modal';
import t from '../styles/tachyons';
import type { Dispatch, ReduxState } from '../data/types';

const TrailerModal = (props: {
  youtubeId: ?string,
  closeTrailerModal: () => void,
}) => (
  <Modal
    contentLabel="Trailer Modal"
    isOpen={!!props.youtubeId}
    onRequestClose={props.closeTrailerModal}
    className={styles.trailerModal}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
    }}
  >
    <YouTube
      opts={{
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
      }}
      videoId={props.youtubeId}
    />
  </Modal>
);

const styles = {
  trailerModal: style({
    top: '6rem',
    left: '1rem',
    right: '1rem',
    bottom: '1rem',
    ...t.overflow_y_hidden,
    [breakpoints.l]: {
      top: '3rem',
      left: '3rem',
      right: '3rem',
      bottom: '3rem',
    },
  }),
};

const mapStateToProps = (state: ReduxState) => ({
  youtubeId: state.ui.youtubeId,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeTrailerModal: () => dispatch(closeTrailerModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrailerModal);
