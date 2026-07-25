/**
 * What the theme asks of Slidev, stated as types.
 *
 * `@slidev/client` is published as TypeScript source rather than as declarations, so a
 * theme that imports it pulls those sources into its own program — where they do not
 * compile: they are written for the program Slidev builds them in, with compile-time
 * flags its bundler replaces and a `vue-router` augmentation that never reaches a
 * consumer. tsconfig points the import here instead, which keeps the theme's own files
 * checked without asking a dependency's internals to pass a check they were never
 * written for.
 *
 * The consequence worth knowing: this is the whole client surface the theme is allowed
 * to see. Reaching for another of its composables means declaring it here first — and
 * the declaration is a claim about Slidev that only driving a real deck can settle.
 */

import type { ClicksContext } from '@slidev/types'
import type { ComputedRef, Ref } from 'vue'

/** The slide a component is mounted on: which click it is at, and its length to declare. */
export declare function useSlideContext(): {
  $clicks: Ref<number>
  $clicksContext: ClicksContext
}

export declare function useNav(): { isPrintMode: ComputedRef<boolean> }

/** True while this slide is the one on screen. Printing reports every slide as active. */
export declare function useIsSlideActive(): ComputedRef<boolean>
