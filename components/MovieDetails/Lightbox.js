/* @flow */

import React, { PureComponent } from 'react';

type Props = {
  imageUrls: Array<string>,
  startIndex: number,
  onCloseRequest: () => void,
};
type State = {
  activeImageIdx: number,
};

let ReactImageLightbox;
class Lightbox extends PureComponent {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    ReactImageLightbox = require('react-image-lightbox');

    this.state = {
      activeImageIdx: props.startIndex,
    };
  }

  handleMovePrevRequest = () => {
    const { imageUrls } = this.props;
    const { activeImageIdx } = this.state;

    this.setState({
      activeImageIdx: (activeImageIdx + 1) % imageUrls.length,
    });
  };

  handleMoveNextRequest = () => {
    const { imageUrls } = this.props;
    const { activeImageIdx } = this.state;

    this.setState({
      activeImageIdx:
        (activeImageIdx + (imageUrls.length - 1)) % imageUrls.length,
    });
  };

  render() {
    const { imageUrls, onCloseRequest } = this.props;
    const { activeImageIdx } = this.state;

    const nextSrc = imageUrls.length === 1
      ? undefined
      : imageUrls[(activeImageIdx + 1) % imageUrls.length];
    const prevSrc = imageUrls.length === 1
      ? undefined
      : imageUrls[(activeImageIdx + (imageUrls.length - 1)) % imageUrls.length];

    return (
      <ReactImageLightbox
        mainSrc={imageUrls[activeImageIdx]}
        nextSrc={nextSrc}
        prevSrc={prevSrc}
        onCloseRequest={onCloseRequest}
        onMovePrevRequest={this.handleMovePrevRequest}
        onMoveNextRequest={this.handleMoveNextRequest}
        animationDisabled
      />
    );
  }
}

export default Lightbox;
