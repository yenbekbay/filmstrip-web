/* @flow */

import { style } from 'next/css';
import { Translator } from 'counterpart';
import _ from 'lodash/fp';
import React, { Component } from 'react';
import Select from 'react-select';

import breakpoints from '../styles/breakpoints';
import colors from '../styles/colors';
import t from '../styles/tachyons';
import withTranslator from '../hocs/withTranslator';

type Props = {
  genres: ?Array<string>,
  selectedGenres: ?Array<string>,
  loading: ?boolean,
  onSelectedGenresChange: (genres: Array<string>) => void,
  translator: Translator,
};
type State = {
  selectedGenres: Array<string>,
};

class FeedGenresSelector extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      selectedGenres: props.selectedGenres || [],
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(nextProps.genres, this.props.genres)) {
      this.setState({ selectedGenres: [] });
      this.props.onSelectedGenresChange([]);
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return nextProps.loading !== this.props.loading ||
      !_.isEqual(nextProps.genres, this.props.genres) ||
      !_.isEqual(this.state, nextState);
  }

  _handleSelectedGenresChange = (genres: Array<Object>) => {
    const selectedGenres = _.map('value', genres);

    this.setState({ selectedGenres });
    this.props.onSelectedGenresChange(selectedGenres);
  };

  render() {
    const { genres, loading, translator } = this.props;

    const genreOptions = (genres || []).map((genre: string) => ({
      value: genre,
      label: genre,
    }));

    return (
      <div className={styles.container}>
        <Select
          multi
          instanceId="1"
          placeholder={translator.translate('ui.genresSelectorPlaceholder')}
          value={this.state.selectedGenres}
          isLoading={loading}
          options={genreOptions}
          onChange={this._handleSelectedGenresChange}
        />
      </div>
    );
  }
}

const styles = {
  container: style({
    '& > .Select': {
      width: '20rem',
      ...t.mb2,
    },
    '& .Select-control': {
      ...t.bg_transparent,
      ...t.b__white_20,
      paddingBottom: 2,
    },
    '& .Select-value, & .Select-value-icon, & .Select-value-label': {
      ...t.bg_transparent,
      ...t.b__white_20,
      ...t.white,
    },
    '& .Select-value-icon:hover, & .Select-value-icon:focus': {
      ...t.white,
      ...t.bg_white_10,
    },
    '& .Select.is-focused:not(.is-open) > .Select-control': {
      ...t.b__white,
    },
    '& .Select-menu-outer': {
      backgroundColor: colors.bg,
      ...t.b__white_20,
    },
    '& .Select-option': {
      ...t.bg_transparent,
      ...t.white,
    },
    '& .Select-option.is-focused': {
      ...t.bg_white_10,
    },
    [breakpoints.l]: {
      '& > .Select': {
        ...t.mb0,
      },
    },
  }),
};

export default withTranslator(FeedGenresSelector);
