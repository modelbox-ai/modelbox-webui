module.exports = {
  globals: {
  },
  rules: {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    "@typescript-eslint/no-inferrable-types": [0],
    "@typescript-eslint/no-parameter-properties": [0],
  }
};
