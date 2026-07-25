import antfu from '@antfu/eslint-config'

/**
 * The style the theme was already written in, stated so that a review never has to
 * mention it — the same preset the official Slidev themes are linted with.
 *
 * Formatting the stylesheets is deliberately left out. Their rules are grouped by hand,
 * with a blank line where one declaration stops being about the same thing as the last,
 * and a formatter would close every one of those gaps.
 *
 * The two exceptions come last rather than as options, so that nothing the preset sets up
 * afterwards turns them back on.
 */
export default antfu(
  {
    ignores: [
      'dist',
      // release-please writes this one, and will write it back its own way.
      '.release-please-manifest.json',
    ],
  },
  {
    // A slide is a document of its own and a deck is a file of slides, so one H1 per page
    // is the format rather than a mistake.
    files: ['**/*.md'],
    rules: { 'markdown/no-multiple-h1': 'off' },
  },
  {
    // The rule asks for pnpm settings the repository has not decided it wants, and that is
    // a decision to take deliberately rather than one to be told about by a linter.
    files: ['pnpm-workspace.yaml'],
    rules: { 'pnpm/yaml-enforce-settings': 'off' },
  },
)
