/* @flow */

import { Component, createElement } from 'react';
import { Translator } from 'counterpart';
import hoistNonReactStatics from 'hoist-non-react-statics';
import Translate from 'react-translate-component';

import { getDisplayName } from './_utils';
import type { WrappableComponent } from './_utils';

type Context = {
  translator: Translator,
};
type State = {
  locale: string,
};

const withTranslator = (WrappedComponent: WrappableComponent) => {
  class WithTranslator extends Component {
    context: Context;
    state: State;
    translator: Translator;

    static displayName = `withTranslator(${getDisplayName(WrappedComponent)})`;
    static contextTypes = { translator: Translate.translatorType };

    constructor(props: any, context: Context) {
      super(props, context);

      this.state = {
        locale: context.translator.getLocale(),
      };
      this.translator = context.translator;
    }

    componentDidMount() {
      this.translator.onLocaleChange(this._handleLocaleChange);
    }

    componentWillUnmount() {
      this.translator.offLocaleChange(this._handleLocaleChange);
    }

    _handleLocaleChange = (locale: string) => {
      this.setState({ locale });
    };

    render() {
      return createElement(WrappedComponent, {
        ...this.props,
        translator: this.translator,
        lang: this.state.locale,
      });
    }
  }

  return hoistNonReactStatics(WithTranslator, WrappedComponent, {});
};

export default withTranslator;
