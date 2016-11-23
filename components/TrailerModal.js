/* @flow */

import { connect } from 'react-redux';
import Modal from 'react-modal';
import React from 'react';
import YouTube from 'react-youtube';

import { closeTrailerModal } from '../data/actions/ui';
import type { Dispatch, ReduxState } from '../data/types';

const TrailerModal = (props: {
  youtubeId: ?string,
  closeTrailerModal: () => void,
}) => (
  <Modal
    isOpen={!!props.youtubeId}
    onRequestClose={props.closeTrailerModal}
    style={{
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      },
      content: {
        border: 0,
        backgroundColor: 'transparent',
      },
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

const mapStateToProps = (state: ReduxState) => ({
  youtubeId: state.ui.youtubeId,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeTrailerModal: () => dispatch(closeTrailerModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrailerModal);
