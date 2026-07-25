import type { InjectionKey, Ref } from 'vue'

/**
 * The stage: what it hands its pieces, and how something is measured against it.
 *
 * Nothing here refers to coordinates a deck writes. A piece is named, and a frame drawn
 * around it finds it by that name and takes its geometry from the piece itself — so
 * inserting a block renumbers nothing.
 */

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

export interface Box {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Reads a reference to pieces. Several names give a frame the box that contains them
 * all, so neighbours read as a range; nothing at all frames nothing, which is how a
 * frame waits offstage until the click it belongs to.
 */
export function namesOf(value: string | readonly string[] | null | undefined): string[] {
  if (!value)
    return []
  return (Array.isArray(value) ? value : String(value).split(','))
    .map(name => name.trim())
    .filter(Boolean)
}

/**
 * The pieces a stage holds under those names, in the order they were asked for.
 *
 * The names are compared rather than written into a selector. A deck's name is prose — it
 * may hold a space, a quote, anything the speaker found clearest — and there is no
 * escaping that makes arbitrary prose safe in both an attribute selector and its string,
 * so the comparison is done where the value is a value.
 */
export function piecesNamed(root: ParentNode, names: readonly string[]): HTMLElement[] {
  if (!names.length)
    return []

  const named = new Map<string, HTMLElement>()

  for (const el of root.querySelectorAll<HTMLElement>('[data-tf-name]')) {
    const name = el.dataset.tfName
    if (name && !named.has(name))
      named.set(name, el)
  }

  return names
    .map(name => named.get(name))
    .filter((el): el is HTMLElement => el !== undefined)
}

/**
 * Where a piece sits on the stage, counted up the chain rather than read off the piece.
 *
 * offsetLeft is measured against the offsetParent, and which ancestor that is changes
 * while a figure arrives: the rise is a `translate`, and a translated element becomes the
 * containing block for everything inside it. A piece in a group would otherwise report
 * its place within that group — nought, for the first one — while the frame around it is
 * placed against the stage. Two origins, one number.
 *
 * Counting the chain is the same value whether or not an arrival is in flight, because
 * offsetLeft carries no transform of its own — only the choice of what it is measured
 * from.
 */
export function placeIn(el: HTMLElement, root: HTMLElement): { left: number, top: number } {
  let left = 0
  let top = 0

  for (let node: HTMLElement | null = el; node && node !== root; node = node.offsetParent as HTMLElement | null) {
    left += node.offsetLeft
    top += node.offsetTop
  }

  return { left, top }
}

/** The box that contains every one of them, or nothing when there is nothing to contain. */
export function bounds(boxes: readonly Box[]): Box | undefined {
  if (!boxes.length)
    return undefined

  const left = Math.min(...boxes.map(b => b.left))
  const top = Math.min(...boxes.map(b => b.top))
  const right = Math.max(...boxes.map(b => b.left + b.width))
  const bottom = Math.max(...boxes.map(b => b.top + b.height))

  return { left, top, width: right - left, height: bottom - top }
}
