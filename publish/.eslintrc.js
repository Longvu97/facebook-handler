module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'object-curly-newline': 'off',
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
    'max-len': 'off',
  },
  plugins: ['jest'],
  ignorePatterns: ['test.js', '/coverage'],
};
