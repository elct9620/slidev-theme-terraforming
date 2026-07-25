import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

/**
 * Runs a composable inside a component, because these ones own a registration for as
 * long as they are mounted: what they declare on the way in and take back on the way
 * out is half of what there is to test about them.
 *
 * `around` runs in a parent's setup, which is where anything the composable injects has
 * to be provided from — a stage dealing out places, say.
 */
export function withSetup<T>(composable: () => T, around?: () => void): { result: T, wrapper: VueWrapper } {
  let result: T | undefined

  const piece = defineComponent({
    setup() {
      result = composable()
      return () => null
    },
  })

  const wrapper = mount(defineComponent({
    setup() {
      around?.()
      return () => h(piece)
    },
  }))

  return { result: result as T, wrapper }
}
