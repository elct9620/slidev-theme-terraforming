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

    // A size utility is reached for when placing a single line — a label, a caption —
    // so each step carries the leading that case wants. Copy that wraps asks for
    // leading-body instead, or gets it from the element rules in layout.css.
    fontSize: {
      title: ['var(--text-title)', 'var(--leading-none)'],
      heading: ['var(--text-heading)', 'var(--leading-none)'],
      body: ['var(--text-body)', 'var(--leading-none)'],
      sub: ['var(--text-sub)', 'var(--leading-none)'],
      note: ['var(--text-note)', 'var(--leading-none)'],
    },

    lineHeight: {
      none: 'var(--leading-none)',
      heading: 'var(--leading-heading)',
      body: 'var(--leading-body)',
    },

    // Motion a deck adds itself keeps time with the motion the theme already has,
    // rather than restating a length that would then drift from it.
    duration: {
      travel: 'var(--tf-motion-travel)',
      settle: 'var(--tf-motion-settle)',
      touch: 'var(--tf-motion-touch)',
      delay: 'var(--tf-motion-delay)',
      stagger: 'var(--tf-motion-stagger)',
    },

    easing: {
      move: 'var(--tf-motion-ease-move)',
      fade: 'var(--tf-motion-ease-fade)',
    },

    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },

    // The numeric scale is left alone: on a 1920 canvas a Figma px divided by 4 is
    // already the UnoCSS number. Only the recurring layout constants earn a name.
    spacing: {
      'line': 'var(--spacing-line)',
      'shadow': 'var(--spacing-shadow)',
      'sidebar': 'var(--spacing-sidebar)',
      'slash': 'var(--spacing-slash)',
      'block-w': 'var(--spacing-block-w)',
      'block-h': 'var(--spacing-block-h)',
    },

    maxWidth: {
      content: 'var(--container-content)',
    },
  },
}))
