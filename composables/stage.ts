import type { InjectionKey, Ref } from 'vue'

/**
 * The stage hands its own element down so that a Focus placed inside it can measure
 * the pieces it frames. Passing the element rather than a list of children keeps the
 * stage unaware of what it contains: anything carrying a `name` can be framed,
 * including markup a deck writes itself.
 */
export const StageKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('tf-stage')
