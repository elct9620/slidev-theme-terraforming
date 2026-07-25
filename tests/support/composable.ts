import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

/**
 * Runs a composable inside a component, because these ones own a registration for as
 * long as they are mounted: what they declare on the way in and take back on the way
 * out is half of what there is to test about them.
 */
export function withSetup<T>(composable: () => T): { result: T, wrapper: VueWrapper } {
  let result: T | undefined

  const wrapper = mount(defineComponent({
    setup() {
      result = composable()
      return () => null
    },
  }))

  return { result: result as T, wrapper }
}
