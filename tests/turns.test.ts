import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { provideTurns, useTurn } from '../composables/turns'
import { clicks, declaredLengths, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

/** A child that says nothing but which kind it is and whether it is the current one. */
function occupant(kind: string) {
  return defineComponent({
    setup() {
      const { isCurrent } = useTurn(kind)
      return () => h('i', { 'data-kind': kind, 'data-current': isCurrent.value })
    },
  })
}

/** A parent holding whatever kinds of occupant the test writes into it. */
function group(kinds: string[]) {
  return mount(defineComponent({
    setup(_, { slots }) {
      provideTurns()
      return () => h('div', slots.default?.())
    },
  }), {
    slots: { default: () => kinds.map(kind => h(occupant(kind))) },
  })
}

function current(wrapper: ReturnType<typeof group>) {
  return wrapper.findAll('i').map(el => el.attributes('data-current') === 'true')
}

describe('taking turns', () => {
  it('gives the first turn to the first written, before any click', () => {
    expect(current(group(['line', 'line', 'line']))).toEqual([true, false, false])
  })

  it('passes the turn along one click at a time', async () => {
    const turns = group(['line', 'line', 'line'])

    clicks.value = 1
    await turns.vm.$nextTick()

    expect(current(turns)).toEqual([false, true, false])
  })

  // Printing winds the clicks past the end of a slide, and a page holding what it ended
  // on is the same answer useSteps gives.
  it('holds the last turn once the clicks run out', async () => {
    const turns = group(['line', 'line'])

    clicks.value = 9
    await turns.vm.$nextTick()

    expect(current(turns)).toEqual([false, true])
  })

  it('declares a length one short of the turns, so the last has a click to sit on', () => {
    group(['line', 'line', 'line'])

    expect(declaredLengths()).toEqual([{ max: 2, delta: 0 }])
  })

  it('declares nothing when nothing takes a second turn', () => {
    group(['line'])

    expect(declaredLengths()).toEqual([])
  })

  // The reason turns are counted per kind: a component gaining a second thing to change
  // must leave the first meaning what it meant.
  it('counts each kind separately, so kinds run alongside rather than interleaved', async () => {
    const turns = group(['title', 'avatar', 'title', 'avatar', 'title'])

    expect(current(turns)).toEqual([true, true, false, false, false])

    clicks.value = 1
    await turns.vm.$nextTick()

    expect(current(turns)).toEqual([false, false, true, true, false])
  })

  it('comes to the longest kind rather than to their sum', () => {
    group(['title', 'title', 'title', 'avatar', 'avatar'])

    expect(declaredLengths()).toEqual([{ max: 2, delta: 0 }])
  })

  it('is always the current one where there is no group to take a turn in', () => {
    const lone = mount(occupant('line'))

    expect(lone.attributes('data-current')).toBe('true')
  })
})
