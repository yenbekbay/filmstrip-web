module.exports = {
  extends: [
    'anvilabs',
    'anvilabs/jest',
    'anvilabs/react'
  ],
  plugins: [
    'graphql',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,

    'graphql/template-strings': [0, {
      env: 'apollo',
      schemaJson: require('./graphql-schema.json'),
    }],
  }
};
