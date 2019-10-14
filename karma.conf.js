/* eslint-env node */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = (config) => {
  config.set(
    merge(createDefaultConfig(config), {
      esm: {
        nodeResolve: true,
      },

      files: [{
        pattern: 'test/**/*.test.js',
        type: 'module',
      }],
    })
  );

  return config;
};
