/* @flow */

import {css, keyframes} from 'glamor';
import React from 'react';

import {breakpoints, t} from '../../styles';

const loaderAnimation = keyframes({
  '0%': {backgroundPosition: '-700px 0'},
  '100%': {backgroundPosition: '800px 0'},
});

const styles = {
  container: css({
    ...t.br2,
    ...t.mt2,
    ...t.w_100,
    ...t.relative,
    height: '17rem',
    content: '',
    background: '#353A44',
    backgroundImage: 'linear-gradient(to right, #353A44 0%, #2F343F 20%, #353A44 40%, #353A44 100%)',
    animation: `${loaderAnimation} 1s infinite linear`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1400px 600px',
    overflow: 'none',
  }),
  block: css({
    ...t.absolute,
    backgroundColor: '#272B35',
  }),
};

const blocks = [
  {
    top: 0,
    left: 0,
    right: 0,
    height: '2rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {
    bottom: 0,
    left: 0,
    right: 0,
    height: '2rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {
    top: 0,
    left: 0,
    width: '2rem',
    height: '100%',
    [breakpoints.l]: {
      left: '11rem',
    },
  },
  {top: 0, right: '0rem', width: '2rem', height: '100%'},
  {top: '2rem', right: '5rem', width: '3rem', height: '1.5rem'},
  {
    top: '3.5rem',
    left: '2rem',
    right: '5rem',
    height: '1rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {
    top: '4.5rem',
    left: '13rem',
    right: '5rem',
    height: '1rem',
    [breakpoints.l]: {
      left: '24rem',
    },
  },
  {
    top: '5.5rem',
    left: '0rem',
    right: '5rem',
    height: '1.5rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {top: '7rem', right: '5rem', width: '3rem', height: '3.5rem'},
  {
    top: '10.5rem',
    left: 0,
    right: 0,
    height: '1.5rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {
    top: '12rem',
    left: '19rem',
    right: 0,
    height: '1.5rem',
    [breakpoints.l]: {
      left: '30rem',
    },
  },
  {
    top: '13.25rem',
    left: 0,
    right: 0,
    height: '0.5rem',
    [breakpoints.l]: {
      left: '13rem',
    },
  },
  {top: '13.5rem', left: '40rem', right: 0, height: '1.5rem'},
];

const renderBlock = (block: Object, idx: number) => {
  const blockStyle = css(block);

  return <div key={idx} className={`${styles.block} ${blockStyle}`} />;
};

const FeedEntryPlaceholder = () => (
  <div className={styles.container}>
    {blocks.map(renderBlock)}
  </div>
);

export default FeedEntryPlaceholder;
