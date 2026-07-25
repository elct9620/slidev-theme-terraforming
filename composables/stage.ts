import type { InjectionKey, Ref } from 'vue'

/**
 * The stage hands its own element down so that a Focus placed inside it can measure
 * the pieces it frames. Passing the element rather than a list of children keeps the
 * stage unaware of what it contains: anything carrying a `name` can be framed,
 * including markup a deck writes itself.
 */
export const StageKey: InjectionKey<Ref<HTMLElement | undefined>> = Symbol('tf-stage')

/**
 * A stage hands each piece the place it holds in the arrangement, so the pieces
 * arrive in the order they are read. Counting here rather than through CSS index
 * selectors means inserting a piece shifts only what comes after it, and a piece
 * placed outside any stage simply has no place and arrives with the slide.
 *
 * A group hands out no places at all: it exists so that several pieces read as one
 * thing, and one thing arrives whole rather than dealing its contents out.
 */
export const StagePlaceKey: InjectionKey<(() => number) | null> = Symbol('tf-stage-place')
