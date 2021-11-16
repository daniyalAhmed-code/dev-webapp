'use strict'
const severity = "warn";
module.exports = {
  extends: ['react-app', '../.eslintrc.js'],
  overrides: [{
    files: ['.eslintrc.js', './*.js'],
    parserOptions: {
      "ecmaVersion": 2020,
      sourceType: 'script'
    },
    rules: {
      semi: severity,
      indent: severity
    }
  }]
}
