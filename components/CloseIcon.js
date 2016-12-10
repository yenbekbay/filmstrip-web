/* @flow */

import React from 'react';

const CloseIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path
      style={{
        stroke: 'white',
        fill: 'transparent',
        strokeLinecap: 'round',
        strokeWidth: 5,
      }}
      d="M 10,10 L 30,30 M 30,10 L 10,30"
    />
  </svg>
);

export default CloseIcon;
