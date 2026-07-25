import { defineUnoSetup } from '@slidev/types'

/**
 * Wires the design tokens from styles/tokens.css into the UnoCSS theme, so slides.md
 * can write utilities like bg-gunJyo-500, text-body or w-sidebar.
 *
 * What is stored here are var() references, not copies of the values: the CSS custom
 * properties remain the single source, so overriding --color-gunJyo-500 in a deck's
 * own style.css also changes what the utilities emit. Inlining the literals instead
 * would give the stylesheet and the utilities separate copies that drift apart.
 *
 * Slidev merges configs in [theme, addons, user] order, so a deck's uno.config.ts can
 * still override any of this. fontFamily is assigned with `||=` on Slidev's side, so
 * filling it in here keeps fonts.sans from replacing it — which leaves package.json's
 * font settings responsible only for whether a webfont gets fetched, rather than
 * being a second place where the stack is defined.
 */
export default defineUnoSetup(() => ({
  theme: {
    colors: {
      kon: { 500: 'var(--color-kon-500)' },
      gunJyo: { 500: 'var(--color-gunJyo-500)' },
      tamago: { 500: 'var(--color-tamago-500)' },
      jinZamOmi: { 500: 'var(--color-jinZamOmi-500)' },

      // The two roles Slidev has no shortcut of its own for; primary and secondary
      // already arrive as text-primary / bg-primary / border-primary.
      accent: 'var(--slidev-theme-accent)',
      neutral: 'var(--slidev-theme-neutral)',
    },

    // Line height is 100% throughout the design file, so every step carries a
    // line-height of 1 along with it.
    fontSize: {
      title: ['var(--text-title)', '1'],
      heading: ['var(--text-heading)', '1'],
      body: ['var(--text-body)', '1'],
      sub: ['var(--text-sub)', '1'],
      note: ['var(--text-note)', '1'],
    },

    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },

    // The numeric scale is left alone: on a 1920 canvas a Figma px divided by 4 is
    // already the UnoCSS number. Only the recurring layout constants earn a name.
    spacing: {
      line: 'var(--spacing-line)',
      shadow: 'var(--spacing-shadow)',
      sidebar: 'var(--spacing-sidebar)',
      slash: 'var(--spacing-slash)',
      'block-w': 'var(--spacing-block-w)',
      'block-h': 'var(--spacing-block-h)',
    },

    maxWidth: {
      content: 'var(--container-content)',
    },
  },
}))
