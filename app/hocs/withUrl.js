/* @flow */

import {Component, PropTypes, createElement} from 'react';
import _ from 'lodash/fp';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {getDisplayName} from './_utils';
import type {WrappableComponent} from './_utils';
import type {FeedType} from '../components/types';

type Context = {
  url: {
    query: {
      type?: FeedType,
      page?: string,
      id?: string,
      lang?: string,
    },
    pathname: string,
    host: ?string,
    back(): void,
    push(path: string): void,
  },
};

const serializeQuery = _.flow(
  _.map.convert({cap: false})(
    (value: string, key: string) =>
      value ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}` : null,
  ),
  _.compact,
  _.join('&'),
);

const withUrl = (WrappedComponent: WrappableComponent) => {
  class WithUrl extends Component {
    context: Context;

    static displayName = `withUrl(${getDisplayName(WrappedComponent)})`;
    static contextTypes = {url: PropTypes.object};

    _getPath = (pathname: string, query?: Object = {}) => {
      const lang = this.context.url.query.lang;
      const serializedQuery = serializeQuery(
        _.defaults(lang ? {lang} : {}, query),
      );

      return `${pathname}${serializedQuery ? `?${serializedQuery}` : ''}`;
    };

    render() {
      return createElement(WrappedComponent, {
        ...this.props,
        url: this.context.url,
        getPath: this._getPath,
      });
    }
  }

  return hoistNonReactStatics(WithUrl, WrappedComponent, {});
};

export default withUrl;
