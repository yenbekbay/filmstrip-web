/* @flow */

import { connect } from 'react-redux';
import React from 'react';
import YouTube from 'react-youtube';

import { closeTrailerModal } from '../data/actions/ui';
import Modal from './Modal';
import type { Dispatch, ReduxState } from '../data/types';

const TrailerModal = (props: {
  youtubeId: ?string,
  closeTrailerModal: () => void,
}) => (
  <Modal
    contentLabel="Trailer Modal"
    isOpen={!!props.youtubeId}
    onRequestClose={props.closeTrailerModal}
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

const mapStateToProps = (state: ReduxState) => ({
  youtubeId: state.ui.youtubeId,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeTrailerModal: () => dispatch(closeTrailerModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrailerModal);
