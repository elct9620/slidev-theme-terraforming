import type { ShikiSetupReturn } from '@slidev/types'
import { defineShikiSetup } from '@slidev/types'

/**
 * Code takes the GitHub palette the design file specifies:
 * #24292E foreground, #D73A49 keyword, #6F42C1 function, #005CC5 constant,
 * #6A737D comment.
 *
 * The surrounding chrome — background, radius, padding — is stripped in
 * styles/layout.css, because code on these slides is content in its own right rather
 * than an excerpt pasted into a box.
 */
export default defineShikiSetup((): ShikiSetupReturn => {
  return {
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
  }
})
