/**
 * Workspace-wide Prettier configuration.
 * Style decisions are documented in docs/architecture/naming-conventions.md.
 *
 * @type {import('prettier').Config}
 */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  arrowParens: 'always',
  endOfLine: 'lf',
  proseWrap: 'preserve',
};

export default config;
