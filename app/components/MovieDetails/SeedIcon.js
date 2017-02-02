/* @flow */

import React from 'react';

const SeedIcon = (
  {
    scale = 1,
    className,
  }: {
    scale?: number,
    className?: string,
  },
) => (
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
              d="m 0,0 c 0,-2.209 -1.791,-4 -4,-4 l -28,0 c -2.209,0 -4,1.791 -4,4 l 0,28 c 0,2.209 1.791,4 4,4 l 28,0 c 2.209,0 4,-1.791 4,-4 L 0,0 Z"
            />
          </g>
          <g transform="translate(23,8)">
            <path
              style={{
                fill: '#ffffff',
                fillOpacity: 1,
                fillRule: 'nonzero',
                stroke: 'none',
              }}
              d="M 0,0 0,9 7,9 -4,22 -15,9 -8,9 -8,0 0,0 Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

SeedIcon.defaultProps = {
  scale: 1,
};

export default SeedIcon;
