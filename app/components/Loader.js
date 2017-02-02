/* @flow */

import {css, keyframes} from 'glamor';
import React from 'react';

import {t} from '../styles';

const Spinner = (
  {
    className,
  }: {
    className?: string,
  },
) => <div className={`${styles.spinner} ${className || ''}`.trim()} />;

const spinnerAnimation = keyframes({
  to: {transform: 'rotate(360deg)'},
});

const styles = {
  spinner: css({
    ...t.ba,
    ...t.b__white_20,
    animation: `${spinnerAnimation} 1s infinite linear`,
    borderTopColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '50%',
  }),
};

export default Spinner;
