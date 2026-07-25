import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Axis from '../components/Axis.vue'

// The line it draws is a Stroke, which asks the slide whether it is arriving.
vi.mock('@slidev/client', () => import('./support/slidev-client'))

describe('a spectrum', () => {
  it('says what each end of the line means', () => {
    const axis = mount(Axis, { props: { start: 'Fully isolated', end: 'Fully permissive' } })

    expect(axis.findAll('.tf-axis-end').map(end => end.text()))
      .toEqual(['Fully isolated', 'Fully permissive'])
  })

  it('draws the line both diagrams draw, pointing both ways', () => {
    const axis = mount(Axis, { props: { start: 'Manual', end: 'Automatic' } })

    expect(axis.find('.tf-stroke-group').exists()).toBe(true)
    expect(axis.findAll('.tf-stroke polyline')).toHaveLength(2)
  })
})
