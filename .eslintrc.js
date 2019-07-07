module.exports = {
  // Extends the UdeS ESLint config
  extends: 'eslint-config-udes/polymer-2-element',

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  // Limit ESLint to a specific project
  root: true,
};
