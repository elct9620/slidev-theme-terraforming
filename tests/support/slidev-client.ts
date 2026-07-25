/**
 * Stands in for `@slidev/client`, which cannot be loaded here: it reaches for
 * `#slidev/slides`, a module only Slidev's own Vite plugin provides.
 *
 * Mocking at that boundary is the point rather than a workaround. Whether Slidev resolves
 * the registrations a component makes into the right slide length is Slidev's own
 * contract, and belongs to a test that drives a real deck; what belongs here is whether
 * the theme registers the right thing in the first place.
 *
 * Every export is annotated against the surface the theme is checked against, so this
 * double cannot answer in a shape the components were not compiled to expect.
 */
import type * as SlidevClient from '@slidev/client'
import type { ClicksContext } from '@slidev/types'
import { computed } from 'vue'
import { clicks, isActive, isPrintMode, registrations } from './slide'

const clicksContext = {
  register(el: unknown, info: { max: number, delta: number } | null) {
    if (info)
      registrations.set(el, info)
    else
      registrations.delete(el)
  },
  unregister(el: unknown) {
    registrations.delete(el)
  },
} as unknown as ClicksContext

export const useSlideContext: typeof SlidevClient.useSlideContext = () =>
  ({ $clicks: clicks, $clicksContext: clicksContext })

// A test drives the state; a component only reads it, exactly as Slidev hands it over.
export const useNav: typeof SlidevClient.useNav = () =>
  ({ isPrintMode: computed(() => isPrintMode.value) })

export const useIsSlideActive: typeof SlidevClient.useIsSlideActive = () =>
  computed(() => isActive.value)
