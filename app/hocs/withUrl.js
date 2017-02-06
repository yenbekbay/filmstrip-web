/* @flow */

import {Component, PropTypes, createElement} from 'react';
import _ from 'lodash/fp';
import hoistNonReactStatics from 'hoist-non-react-statics';

import {getDisplayName} from './_utils';
import type {WrappableComponent} from './_utils';
import type {FeedType} from '../components/types';

type Context = {
  url: {
    host: ?string,
    pathname: string,
    query: {
      type?: FeedType,
      page?: string,
      id?: string,
      lang?: string,
    },
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

    _getPath = (
      {
        pathname: newPathname,
        query: newQuery = {},
      }: {
        pathname?: string,
        query?: Object,
      },
    ) => {
      const {pathname: currentPathname, query: currentQuery} = this.context.url;

      const pathname = newPathname || currentPathname;
      const query = currentPathname === pathname
        ? _.defaults(currentQuery, newQuery)
        : newQuery;
      const lang = currentQuery.lang;
      const queryWithLang = lang ? _.defaults({lang}, query) : query;
      const serializedQuery = serializeQuery(queryWithLang);

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
