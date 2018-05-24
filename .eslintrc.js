module.exports = {
  parser: 'babel-eslint',
  env: {
      browser: true,
      commonjs: true,
      es6: true,
      node: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
      ecmaFeatures: {
      experimentalObjectRestSpread: true
      },
      sourceType: 'module'
  },
  plugins: [],
  rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'no-console': ['warn', { allow: ['info', 'error'] }]
  }
};