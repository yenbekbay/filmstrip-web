/* @flow */

/* based on https://github.com/jongold/tachyons-js */

import fs from 'fs';
import path from 'path';

/* eslint-disable import/no-extraneous-dependencies */
import { parse as parseCss } from 'css';
import _ from 'lodash/fp';
import 'isomorphic-fetch';
/* eslint-enable import/no-extraneous-dependencies */

const tachyonsCdnUrl = 'https://unpkg.com/tachyons@latest/css/tachyons.css';

const dashRegex = /-/g;
const leadingDotRegex = /^\./;
const transformSelector = (selector: string) => selector
  .replace(dashRegex, '_')
  .replace(leadingDotRegex, '');

const blacklistedProperties = [
  '-webkit-transition',
  '-webkit-transform',
];
const shouldRejectProperty = _.memoize(_.overSome([
  _.includes(_, blacklistedProperties),
  _.startsWith('-webkit-box'),
  _.startsWith('-ms-flex'),
]));

const webkitPrefixPattern = /^webkit/;
const mozPrefixPattern = /^moz/;
const transformProperty = _.memoize(_.flow(
  _.camelCase,
  _.replace(webkitPrefixPattern, 'Webkit'),
  _.replace(mozPrefixPattern, 'Moz'),
));

const stylesFromRules = (rules: Array<Object>): Array<Object> => _.flow(
  _.filter(['type', 'rule']),
  _.map(({ declarations, selectors }: Object) => _.flow(
    _.filter(_.startsWith('.')),
    _.reject(_.startsWith('.debug')),
    _.map((selector: string) => ({
      [transformSelector(selector)]: _.flow(
        _.reject(_.flow(_.get('property'), shouldRejectProperty)),
        _.map(({ property, value }: Object) => [
          transformProperty(property),
          value,
        ]),
        _.fromPairs,
      )(declarations),
    })),
  )(selectors)),
  _.flatten,
  _.mergeAll,
)(rules);

const pseudos = [
  'hover',
  'active',
  'link',
  'focus',
  'visited',
];
const extractPseudoSelectors = (pseudo: string) => (styles: Object) => _.reduce(
  (acc: Object, selector: string) => {
    if (_.includes(`:${pseudo}`, selector)) {
      const [rootSelector, descendantSelector] = selector.split(`:${pseudo}`);

      return _.flow(
        _.merge(_, {
          [rootSelector]: {
            [`:${pseudo}${descendantSelector}`]: styles[selector],
          },
        }),
        _.unset(selector),
      )(acc);
    }

    return acc;
  },
  styles,
  _.keys(styles),
);

const writeFile = (file: string) => new Promise((
  resolve: () => void,
  reject: (err: Error) => void,
) => {
  fs.writeFile(
    path.join(__dirname, '../styles/tachyons.js'),
    file,
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    (err: ?Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    },
  );
});

(async () => {
  try {
    const res = await fetch(tachyonsCdnUrl);
    const css = (await res.text()).replace(/\s+/g, ' ');

    const { stylesheet } = parseCss(css);

    const rootStyles = stylesFromRules(stylesheet.rules);

    const mediaStyles = _.flow(
      _.filter(['type', 'media']),
      _.map(({ media, rules }: Object) => _.mapValues(
        (styles: Object) => ({ [`@media ${media}`]: styles }),
        stylesFromRules(rules),
      )),
      _.flatten(),
      _.mergeAll,
    )(stylesheet.rules);

    const file = _.flow(
      _.mergeAll,
      _.flow(pseudos.map(extractPseudoSelectors)),
      (js: Object) => JSON.stringify(js, null, 2),
      (json: string) => `module.exports = ${json}`,
    )([rootStyles, mediaStyles]);

    await writeFile(file);
  } catch (err) {
    console.error(err.message); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
  }
})();
