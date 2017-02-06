/* @flow */

/* based on https://github.com/jongold/tachyons-js */

import fs from 'fs';
import path from 'path';

import {parse as parseCss} from 'css';
import _ from 'lodash/fp';
import 'isomorphic-fetch';

const tachyonsCdnUrl = 'https://unpkg.com/tachyons@latest/css/tachyons.css';

const dashRegex = /-/g;
const leadingDotRegex = /^\./;
const transformSelector = (selector: string) =>
  selector.replace(dashRegex, '_').replace(leadingDotRegex, '');

const blacklistedProperties = ['-webkit-transition', '-webkit-transform'];
const shouldRejectProperty = _.memoize(
  _.overSome([
    _.includes(_, blacklistedProperties),
    _.startsWith('-webkit-box'),
    _.startsWith('-ms-flex'),
  ]),
);

const webkitPrefixPattern = /^webkit/;
const mozPrefixPattern = /^moz/;
const transformProperty = _.memoize(
  _.flow(
    _.camelCase,
    _.replace(webkitPrefixPattern, 'Webkit'),
    _.replace(mozPrefixPattern, 'Moz'),
  ),
);

const stylesFromRules = (rules: Array<Object>): Array<Object> => _.flow(
  _.filter(['type', 'rule']),
  _.flatMap(({declarations, selectors}: Object) => _.flow(
    _.filter(_.startsWith('.')),
    _.reject(_.startsWith('.debug')),
    _.map((selector: string) => ({
      [transformSelector(selector)]: _.flow(
        _.reject(_.flow(_.get('property'), shouldRejectProperty)),
        _.map(({property, value}: Object) => [
          transformProperty(property),
          value,
        ]),
        _.fromPairs,
      )(declarations),
    })),
  )(selectors)),
  _.mergeAll,
)(rules);

const pseudos = ['hover', 'active', 'link', 'focus', 'visited'];
const extractPseudoSelectors = (pseudo: string) => (styles: Object) => _.reduce(
  (acc: Object, selector: string) => {
    if (_.includes(`:${pseudo}`, selector)) {
      const [rootSelector, descendantSelector] = selector.split(`:${pseudo}`);

      const pseudoSelector = `:${pseudo}${descendantSelector}`;

      return _.flow(
        // skip all `focus` pseudo-class styles
        // and only apply `hover` pseudo-class styles to non-touch screens
        pseudo === 'focus'
          ? _.identity
          : _.merge(
              _,
              pseudo === 'hover'
                ? {
                    [rootSelector]: {
                      '@media (pointer: fine)': {
                        [pseudoSelector]: styles[selector],
                      },
                    },
                  }
                : {
                    [rootSelector]: {
                      [pseudoSelector]: styles[selector],
                    },
                  },
            ),
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
  fs.writeFile(path.join(__dirname, '../src/styles/tachyons.js'), file, (
    err: ?Error,
  ) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

(async () => {
  try {
    const res = await fetch(tachyonsCdnUrl);
    const css = (await res.text()).replace(/\s+/g, ' ');

    const {stylesheet} = parseCss(css);

    const rootStyles = stylesFromRules(stylesheet.rules);

    const mediaStyles = _.flow(
      _.filter(['type', 'media']),
      _.flatMap(({media, rules}: Object) =>
        _.mapValues(
          (styles: Object) => ({[`@media ${media}`]: styles}),
          stylesFromRules(rules),
        )),
      _.mergeAll,
    )(stylesheet.rules);

    const file = _.flow(
      _.mergeAll,
      _.flow(...pseudos.map(extractPseudoSelectors)),
      (js: Object) => JSON.stringify(js, null, 2),
      (json: string) => `module.exports = ${json}`,
    )([rootStyles, mediaStyles]);

    await writeFile(file);
  } catch (err) {
    console.error(err.message); // eslint-disable-line no-console
    process.exit(1); // eslint-disable-line unicorn/no-process-exit
  }
})();
