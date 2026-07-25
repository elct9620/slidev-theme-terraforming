import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

/**
 * Two suites, because they answer different kinds of question.
 *
 * `unit` is what a component decides: whether it declares the right length, whether a
 * figure thinks it should be arriving, where a frame puts itself. It runs against
 * happy-dom, which carries no layout engine, so every offset it reports is zero and
 * anything geometric has to be reached as arithmetic over stand-in values.
 *
 * `deck` drives the fixture through Slidev's own server and a real browser, which is the
 * only place the answers Slidev gives back can be seen: how long a slide turned out to be
 * once every registration on it was resolved, and what a page being printed renders. It
 * costs a browser and half a minute, so it is kept out of the suite that runs while
 * working.
 */
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [vue()],
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['tests/*.test.ts'],
        },
      },
      {
        test: {
          name: 'deck',
          environment: 'node',
          include: ['tests/deck/*.test.ts'],
          testTimeout: 60_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
})
