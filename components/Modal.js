/* @flow */

import { style } from 'next/css';
import Modal from 'react-modal';
import React from 'react';

import t from '../styles/tachyons';

const Modal_ = (props: Object & {
  onRequestClose: () => void,
  className: string,
}) => (
  <Modal
    {...props}
    className={`${styles.modal} ${props.className}`}
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
          props.onRequestClose();
        }
      };

      el && el.addEventListener('touchend', handler);
    }}
  >
    {props.children}
  </Modal>
);

const styles = {
  modal: style({
    ...t.absolute,
    ...t.overflow_auto,
    ...t.outline_0,
  }),
};

export default Modal_;
