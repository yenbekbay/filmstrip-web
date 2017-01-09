/* @flow */

import React from 'react';

const PeerIcon = ({ scale = 1, className }: {
  scale?: number,
  // eslint-disable-next-line react/require-default-props
  className?: string,
}) => (
  <svg
    width={`${47.5 * scale}px`}
    height={`${47.5 * scale}px`}
    viewBox="0 0 47.5 47.5"
    className={className}
  >
    <defs>
      <clipPath id="clipPath16" clipPathUnits="userSpaceOnUse">
        <path d="M 0,38 38,38 38,0 0,0 0,38 Z" />
      </clipPath>
    </defs>
    <g transform="matrix(1.25,0,0,-1.25,0,47.5)">
      <g id="g12">
        <g clipPath="url(#clipPath16)">
          <g transform="translate(37,5)">
            <path
              style={{
                fill: '#3b88c3',
                fillOpacity: 1,
                fillRule: 'nonzero',
                stroke: 'none',
              }}
              d="m 0,0 c 0,-2.209 -1.791,-4 -4,-4 l -28,0 c -2.209,0 -4,1.791 -4,4 l 0,28 c 0,2.209 1.791,4 4,4 l 28,0 c 2.209,0 4,-1.791 4,-4 L 0,0 Z" // eslint-disable-line max-len
            />
          </g>
          <g transform="translate(23,30)">
            <path
              style={{
                fill: '#ffffff',
                fillOpacity: 1,
                fillRule: 'nonzero',
                stroke: 'none',
              }}
              d="m 0,0 0,-9 7,0 -11,-13 -11,13 7,0 0,9 8,0 z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

PeerIcon.defaultProps = {
  scale: 1,
};

export default PeerIcon;
