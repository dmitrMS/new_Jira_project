module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true
  },
  plugins: ['jest', 'prettier'],
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    ecmaVersion: 'latest'
  },
  rules: { 'prettier/prettier': 2 }
};
