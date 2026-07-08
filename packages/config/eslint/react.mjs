import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/**
 * React ESLint flat config, meant to be layered on top of the base config and
 * scoped by the consumer to React packages only (via `files`).
 *
 * `react/prop-types` is disabled because prop contracts are enforced by
 * TypeScript. The React version is pinned to the workspace-wide React major.
 */
export const reactConfig = [
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: '19.2',
      },
    },
  },
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooksPlugin.configs.flat.recommended,
  {
    rules: {
      'react/prop-types': 'off',
    },
  },
];
