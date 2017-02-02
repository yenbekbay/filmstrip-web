/* @flow */

import {connect} from 'react-redux';
import {css} from 'glamor';
import React from 'react';

import {openTrailerModal} from '../../data/actions/ui';
import {t} from '../../styles';
import PlayIcon from './PlayIcon';
import type {Dispatch} from '../../data/types';

const PlayTrailerButton = (
  props: {
    youtubeId: string,
    scale?: number,
    openTrailerModal(youtubeId: string): void,
  },
) => (
  <button
    className={styles.trailerPlayButton}
    style={{
      width: 50 * (props.scale || 1),
      height: 50 * (props.scale || 1),
    }}
    onClick={() => props.openTrailerModal(props.youtubeId)}
  >
    <PlayIcon scale={props.scale} />
  </button>
);

PlayTrailerButton.defaultProps = {
  scale: 1,
};

const styles = {
  trailerPlayButton: css({
    ...t.absolute,
    ...t.absolute__fill,
    ...t.input_reset,
    ...t.button_reset,
    ...t.bg_transparent,
    ...t.pa0,
    ...t.o_90,
    ...t.outline_0,
    ...t.bn,
    margin: 'auto',
    ':hover': t.o_100,
  }),
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openTrailerModal: (youtubeId: string) => {
    dispatch(openTrailerModal(youtubeId));
  },
});

export default connect(null, mapDispatchToProps)(PlayTrailerButton);
