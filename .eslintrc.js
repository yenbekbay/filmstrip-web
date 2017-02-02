module.exports = {
  extends: [
    'anvilabs',
    'anvilabs/jest',
    'anvilabs/lodash',
    'anvilabs/react'
  ],
  plugins: [
    'graphql',
  ],
  rules: {
    'indent': 0,
    'no-confusing-arrow': 0,
    'no-magic-numbers': 0,
    'no-mixed-operators': 0,

    'babel/object-curly-spacing': [2, 'never'],

    'import/no-extraneous-dependencies': 0,

    'graphql/template-strings': [2, {
      env: 'apollo',
      schemaJson: require('./graphql-schema.json'),
    }],

    'promise/prefer-await-to-callbacks': 0,

    'react/jsx-closing-bracket-location': 0,
    'react/jsx-indent-props': 0,
    'react/jsx-indent': 0,
    'react/require-default-props': 0
  }
};
