/* @flow */

import { connect } from 'react-redux';
import { style } from 'next/css';
import Modal from 'react-modal';
import React from 'react';
import YouTube from 'react-youtube';

import { closeTrailerModal } from '../data/actions/ui';
import breakpoints from '../styles/breakpoints';
import t from '../styles/tachyons';
import type { Dispatch, ReduxState } from '../data/types';

const TrailerModal = (props: {
  youtubeId: ?string,
  closeTrailerModal: () => void,
}) => (
  <Modal
    isOpen={!!props.youtubeId}
    onRequestClose={props.closeTrailerModal}
    className={styles.trailerModal}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
    }}
    onAfterOpen={() => {
      const el = document.querySelector('.ReactModal__Overlay');
      const modalEl = document.querySelector('.ReactModal__Content');

      const handler = (event: Object) => {
        const target = event.targetTouches.length > 0
          ? event.targetTouches[0]
          : event.target;

        if (!modalEl.contains(target)) {
          el.removeEventListener('touchend', handler);
          props.closeTrailerModal();
        }
      };

      el && el.addEventListener('touchend', handler);
    }}
  >
    <YouTube
      opts={{
        height: '100%',
        width: '100%',
      }}
      videoId={props.youtubeId}
    />
  </Modal>
);

const styles = {
  trailerModal: style({
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
  youtubeId: state.ui.youtubeId,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeTrailerModal: () => dispatch(closeTrailerModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrailerModal);
