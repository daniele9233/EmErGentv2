import { baseConfig } from '@emergent/config/eslint/base';
import { reactConfig } from '@emergent/config/eslint/react';

/**
 * Root ESLint configuration for the whole monorepo.
 * Linting is centralized here on purpose (single source of truth, no config
 * drift across packages); see docs/architecture/FASE-1-core-architecture.md.
 */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', '**/coverage/**'],
  },
  ...baseConfig,
  ...reactConfig.map((config) => ({
    ...config,
    files: ['packages/ui/**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
