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
    'no-magic-numbers': 0,

    'import/no-extraneous-dependencies': 0,

    'graphql/template-strings': [0, {
      env: 'apollo',
      schemaJson: require('./graphql-schema.json'),
    }],
  }
};
