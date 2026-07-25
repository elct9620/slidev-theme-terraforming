/**
 * What a piece puts on its outermost element.
 *
 * The composables decide it; this is what says it reaches the element — and that the
 * element still states it the one way `v-click` can live with. The directive marks its
 * target by toggling classes with classList, so a piece whose root bound `:class`
 * reactively erased the mark the first time any of its own variants changed, and a
 * `<Focus v-click of="..." />` consumed a click while staying visible the whole way
 * through. Nothing about that failure was visible on the slide.
 */
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Block from '../components/Block.vue'
import Focus from '../components/Focus.vue'
import Group from '../components/Group.vue'
import Stage from '../components/Stage.vue'
import Stroke from '../components/Stroke.vue'
import { clicks, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

describe('a piece on a stage', () => {
  it('states its arrival and its turn as attributes, leaving the class alone', () => {
    const stage = mount(Stage, {
      slots: { default: () => [h(Block, null, () => 'first'), h(Block, null, () => 'second')] },
    })

    const [first, second] = stage.findAll('.tf-block')

    expect(first.attributes('data-tf-enter')).toBe('true')
    expect(first.attributes('style')).toContain('--tf-enter-place: 0')
    expect(second.attributes('style')).toContain('--tf-enter-place: 1')
    expect(first.attributes('class')).toBe('tf-block')
  })

  it('counts a stroke in among the pieces it connects', () => {
    const stage = mount(Stage, {
      slots: { default: () => [h(Block, null, () => 'first'), h(Stroke), h(Block, null, () => 'second')] },
    })

    expect(stage.find('.tf-stroke-group').attributes('style')).toContain('--tf-enter-place: 1')
    expect(stage.findAll('.tf-block')[1].attributes('style')).toContain('--tf-enter-place: 2')
  })

  it('keeps a variant of its own out of the class attribute', () => {
    const stage = mount(Stage, {
      slots: { default: () => h(Block, { color: 'tamago', hidden: true, name: 'sandbox' }, () => 'held') },
    })

    const block = stage.find('.tf-block')

    expect(block.attributes('class')).toBe('tf-block')
    expect(block.attributes('data-tf-color')).toBe('tamago')
    expect(block.attributes('data-tf-hidden')).toBe('true')
    expect(block.attributes('data-tf-name')).toBe('sandbox')
  })

  it('stops arriving at the first click, and stays where it was put', async () => {
    const stage = mount(Stage, { slots: { default: () => h(Block, null, () => 'first') } })

    clicks.value = 1
    await stage.vm.$nextTick()

    const block = stage.find('.tf-block')

    expect(block.attributes('data-tf-enter')).toBeUndefined()
    expect(block.attributes('style')).toContain('--tf-enter-place: 0')
  })
})

describe('a focus on a stage', () => {
  // The measured numbers are all zero here, since happy-dom lays nothing out. What this
  // says is that the frame carries its own geometry and its turn at once: they arrive
  // from two different bindings on the same element.
  it('carries the box it measured alongside its turn in the arrangement', async () => {
    const stage = mount(Stage, {
      slots: { default: () => [h(Block, { name: 'proxy' }, () => 'Proxy'), h(Focus, { of: 'proxy' })] },
    })

    // The frame measures as it mounts, so the geometry reaches the element on the patch
    // after that rather than in the same one.
    await stage.vm.$nextTick()

    const style = stage.find('.tf-focus').attributes('style')

    expect(style).toContain('--tf-enter-place: 1')
    expect(style).toContain('left: 0px')
  })
})

describe('a group on a stage', () => {
  it('arrives whole, dealing no turn out to what it holds', () => {
    const stage = mount(Stage, {
      slots: { default: () => h(Group, { name: 'pool' }, () => [h(Block, null, () => 'a'), h(Block, null, () => 'b')]) },
    })

    expect(stage.find('.tf-group').attributes('data-tf-enter')).toBe('true')

    for (const block of stage.findAll('.tf-block')) {
      expect(block.attributes('data-tf-enter')).toBeUndefined()
      expect(block.attributes('style')).toBeUndefined()
    }
  })
})
