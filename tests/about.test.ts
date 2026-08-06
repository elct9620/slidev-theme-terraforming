import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import About from '../components/About.vue'
import Contact from '../components/Contact.vue'
import Name from '../components/Name.vue'
import Title from '../components/Title.vue'
import { clicks, declaredLengths, resetSlide } from './support/slide'

vi.mock('@slidev/client', () => import('./support/slidev-client'))

beforeEach(resetSlide)

/** An introduction as a deck writes it, in the order the lines are read. */
function introduce(titles: string[], contacts: string[] = []) {
  return mount(About, {
    global: { components: { Name, Title, Contact } },
    slots: {
      default: [
        '<Name>蒼時弦也</Name>',
        ...titles.map(role => `<Title>${role}</Title>`),
        ...contacts.map(line => `<Contact>${line}</Contact>`),
      ].join(''),
    },
  })
}

describe('the speaker introduction', () => {
  it('is whatever lines the deck writes about the person', () => {
    const about = introduce(['Software Architect'], ['https://example.com', '@elct9620'])

    expect(about.find('.tf-about-name').text()).toBe('蒼時弦也')
    expect(about.find('.tf-about-title').text()).toBe('Software Architect')
    expect(about.findAll('.tf-about-contact').map(line => line.text()))
      .toEqual(['https://example.com', '@elct9620'])
  })

  it('ships a portrait for the speaker it was written for, and takes another', () => {
    expect(mount(About).find('.tf-about-portrait').attributes('src')).toContain('avatar')
    expect(mount(About, { props: { avatar: '/ada.png' } })
      .find('.tf-about-portrait').attributes('src')).toBe('/ada.png')
  })

  // The name is written beside the portrait, so repeating it as an alternative would
  // have a screen reader say it twice.
  it('leaves the portrait to the name beside it unless the deck says otherwise', () => {
    expect(mount(About).find('.tf-about-portrait').attributes('alt')).toBe('')
    expect(mount(About, { props: { alt: 'Ada Lovelace' } })
      .find('.tf-about-portrait').attributes('alt')).toBe('Ada Lovelace')
  })

  describe('a role the talk changes', () => {
    const roles = ['Associate Engineer', 'Engineer']

    it('gives the slide a click for every role after the first', () => {
      introduce(roles)

      expect(declaredLengths()).toEqual([{ max: 1, delta: 0 }])
    })

    // Both are on the page throughout: the one leaving has to be there to fade out, and
    // the longest of them is what keeps the column from resizing as the role changes.
    it('lays every role out at once and lights the one being stated', async () => {
      const about = introduce(roles)
      const stated = () => about.findAll('.tf-about-title').map(role => !role.classes('is-off'))

      expect(about.findAll('.tf-about-title').map(role => role.text())).toEqual(roles)
      expect(stated()).toEqual([true, false])

      clicks.value = 1
      await about.vm.$nextTick()

      expect(stated()).toEqual([false, true])
    })

    // Winding past the end is what printing does, and a page holding its last state is
    // the same answer `useSteps` gives.
    it('holds the last role once the clicks run out', async () => {
      const about = introduce(roles)

      clicks.value = 9
      await about.vm.$nextTick()

      expect(about.findAll('.tf-about-title').map(role => role.classes('is-off')))
        .toEqual([true, false])
    })

    it('declares nothing, and states the one role, when the talk never changes it', () => {
      const about = introduce(['Mathematician'])

      expect(declaredLengths()).toEqual([])
      expect(about.find('.tf-about-title').classes('is-off')).toBe(false)
    })
  })
})
