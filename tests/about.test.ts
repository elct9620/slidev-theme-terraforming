import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import About from '../components/About.vue'

describe('the speaker introduction', () => {
  it('introduces the speaker the theme was written for, portrait included', () => {
    const about = mount(About)

    expect(about.find('.tf-about-name').text()).toBe('蒼時弦也')
    expect(about.find('.tf-about-title').text()).toBe('Software Architect')
    expect(about.find('.tf-about-portrait').attributes('src')).toContain('avatar')
  })

  it('takes whatever a deck introduces instead', () => {
    const about = mount(About, {
      props: { name: 'Ada Lovelace', title: 'Mathematician', avatar: '/ada.png' },
      slots: { default: 'https://example.com' },
    })

    expect(about.find('.tf-about-name').text()).toBe('Ada Lovelace')
    expect(about.find('.tf-about-title').text()).toBe('Mathematician')
    expect(about.find('.tf-about-portrait').attributes('src')).toBe('/ada.png')
    expect(about.find('.tf-about-extra').text()).toBe('https://example.com')
  })

  // The portrait is the one image the theme ships, and a name is what it stands in for.
  it('says who the portrait is of', () => {
    const about = mount(About, { props: { name: 'Ada Lovelace' } })

    expect(about.find('.tf-about-portrait').attributes('alt')).toBe('Ada Lovelace')
  })
})
