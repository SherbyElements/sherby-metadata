/* eslint-env node */
const createDefaultConfig = require('@open-wc/testing-karma/default-config');
const merge = require('webpack-merge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [{
        pattern: 'test/**/*.test.js',
        type: 'module',
      }],
    })
  );

  return config;
};
