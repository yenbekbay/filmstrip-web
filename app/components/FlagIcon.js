/* @flow */

import React from 'react';

const FlagIcon = (
  {
    lang,
    height,
  }: {
    lang: string,
    height: number,
  },
) => {
  switch (lang) {
    case 'ru':
      return (
        <svg viewBox="0 0 9 6" width={height * 1.5} height={height}>
          <rect fill="#fff" width="9" height="3" />
          <rect fill="#d52b1e" y="3" width="9" height="3" />
          <rect fill="#0039a6" y="2" width="9" height="2" />
        </svg>
      );
    case 'en':
      return (
        <svg viewBox="0 0 60 30" width={height * 2} height={height}>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
          </clipPath>
          <path d="M0,0 v30 h60 v-30 z" fill="#00247d" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path
            d="M0,0 L60,30 M60,0 L0,30"
            clipPath="url(#t)"
            stroke="#cf142b"
            strokeWidth="4"
          />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6" />
        </svg>
      );
    default:
      return null;
  }
};

export default FlagIcon;
