import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/**
 * What is worth testing here is the click and arrival protocols: a component that
 * declares its own length, and a figure that decides whether it should be arriving.
 * Both fail silently — a slide sits at the wrong length, or a piece is simply already
 * there — so they are the parts that cannot be checked by looking at a slide.
 *
 * happy-dom carries no layout engine, so every offset it reports is zero: nothing here
 * can measure a real element, and anything geometric has to be reached as arithmetic over
 * stand-in values. What only a browser can answer — how a rule cascades, how long a
 * transition takes — stays with driving an actual deck.
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
})
