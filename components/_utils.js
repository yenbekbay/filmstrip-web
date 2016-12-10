/* @flow */

import _ from 'lodash/fp';

const highresImageUrl = (imageUrl: ?string) => {
  if (!imageUrl) return null;

  if (_.includes('image.tmdb.org', imageUrl)) {
    return imageUrl.replace('/w500/', '/w300/');
  }

  return imageUrl;
};
const lowresImageUrl = (imageUrl: ?string) => {
  if (!imageUrl) return null;

  if (_.includes('image.tmdb.org', imageUrl)) {
    return imageUrl.replace(/\/w(1000|500)\//, '/w150/');
  } else if (_.includes('st.kp.yandex.net/images/kadr', imageUrl)) {
    return imageUrl.replace(/kadr\/(\d+\.jpg$)/, 'kadr/sm_$1');
  } else if (_.includes('st.kp.yandex.net/images/film_iphone', imageUrl)) {
    return imageUrl.replace(/iphone360_(\d+\.jpg.*)/, 'iphone60_$1');
  }

  return null;
};

export { highresImageUrl, lowresImageUrl };
