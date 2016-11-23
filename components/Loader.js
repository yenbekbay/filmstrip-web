/* @flow */

import { style, keyframes } from 'next/css';
import React from 'react';

import t from '../styles/tachyons';

const Spinner = () => <div className={styles.spinner} />;

const spinnerAnimation = keyframes({
  to: { transform: 'rotate(360deg)' },
});

const styles = {
  spinner: style({
    ...t.ba,
    ...t.b__white_20,
    ...t.bw3,
    ...t.w4,
    ...t.h4,
    margin: '8rem auto',
    animation: `${spinnerAnimation} 1s infinite linear`,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
  }),
};

export default Spinner;
