/* @flow */

import { style } from 'next/css';
import Modal from 'react-modal';
import React from 'react';

import { t } from '../styles';
import CloseIcon from './CloseIcon';

const Modal_ = (props: Object & {
  onRequestClose: () => void,
}) => {
  const handleRequestClose = () => {
    props.onRequestClose();
    window.openModals -= 1;

    if (window.openModals > 0) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  };

  return (
    <Modal
      {...props}
      className={styles.modal}
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
            handleRequestClose();
          }
        };

        el && el.addEventListener('touchend', handler);
        window.openModals = window.openModals ? window.openModals + 1 : 1;
        document.body.classList.add('modal-open');
      }}
      onRequestClose={handleRequestClose}
    >
      <div className={styles.modalContentContainer}>
        <button
          className={styles.closeButton}
          onClick={handleRequestClose}
        >
          <CloseIcon size={40} />
        </button>
        <div className={`${styles.modalContentInner} ${props.className}`}>
          {props.children}
        </div>
      </div>
    </Modal>
  );
};

const styles = {
  modal: style({
    ...t.absolute,
    ...t.absolute__fill,
    ...t.outline_0,
    ...t.overflow_hidden,
  }),
  modalContentContainer: style({
    ...t.flex,
    ...t.flex_column,
    ...t.h_100,
  }),
  closeButton: style({
    ...t.input_reset,
    ...t.button_reset,
    ...t.bg_transparent,
    ...t.outline_0,
    ...t.bn,
    ...t.w_100,
    ...t.flex,
    ...t.justify_end,
    ...t.items_center,
    ...t.dim,
    ...t.pv0,
    ...t.ph3,
    height: '6rem',
  }),
  modalContentInner: style({
    ...t.overflow_x_hidden,
    ...t.overflow_y_auto,
    flex: 1,
  }),
};

export default Modal_;
