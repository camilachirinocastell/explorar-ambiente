// commitlint.config.mjs
// Commit message rules: Conventional Commits, with the layer as scope.

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['backend', 'frontend', 'repo']],
  },
};
