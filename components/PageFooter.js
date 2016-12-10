/* @flow */

import { style } from 'next/css';
import React from 'react';
import Translate from 'react-translate-component';

import { t } from '../styles';

const PageFooter = () => (
  <footer className={styles.footer}>
    <Translate content="ui.footerText" />
  </footer>
);

const styles = {
  footer: style({
    ...t.tc,
    ...t.pb4,
    ...t.ph4,
    ...t.f6,
    ...t.o_70,
  }),
};

export default PageFooter;
