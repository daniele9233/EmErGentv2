/**
 * Conventional Commits enforcement for the whole monorepo.
 * The scope enum mirrors workspace packages/apps plus repo-level scopes,
 * so commit history stays navigable per module. Scope is optional.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'repo',
        'config',
        'contracts',
        'utils',
        'ui',
        'api',
        'web',
        'realtime',
        'agent-worker',
        'deploy-worker',
        'sandbox-orchestrator',
        'preview-proxy',
        'docs',
        'ci',
        'deps',
        'release',
      ],
    ],
  },
};
