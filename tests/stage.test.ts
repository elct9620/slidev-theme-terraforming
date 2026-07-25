import { describe, expect, it } from 'vitest'
import { bounds, namesOf, piecesNamed, placeIn } from '../composables/stage'

/**
 * A stand-in for a piece on a stage. happy-dom lays nothing out, so every real offset it
 * reports is zero — the arithmetic is the part worth testing, and it is tested over nodes
 * whose offsets are stated rather than measured.
 */
function node(offsetLeft: number, offsetTop: number, offsetParent: unknown = null) {
  return { offsetLeft, offsetTop, offsetParent } as unknown as HTMLElement
}

describe('namesOf', () => {
  it('reads one name', () => {
    expect(namesOf('proxy')).toEqual(['proxy'])
  })

  it('reads a list, so neighbours can be framed as a range', () => {
    expect(namesOf('proxy, object')).toEqual(['proxy', 'object'])
    expect(namesOf(['proxy', 'object'])).toEqual(['proxy', 'object'])
  })

  it('frames nothing when there is nothing to frame', () => {
    expect(namesOf(undefined)).toEqual([])
    expect(namesOf(null)).toEqual([])
    expect(namesOf('')).toEqual([])
    expect(namesOf([])).toEqual([])
  })

  it('keeps a trailing comma from asking for a piece with no name', () => {
    expect(namesOf('proxy, ')).toEqual(['proxy'])
  })
})

describe('placeIn', () => {
  it('reads a place off the piece when the stage is what it is measured against', () => {
    const stage = node(100, 100)

    expect(placeIn(node(44, 12, stage), stage)).toEqual({ left: 44, top: 12 })
  })

  it('counts the chain up to the stage, so an arrival cannot move the answer', () => {
    // While a group arrives it carries a translate, which makes it the containing block
    // for what it holds: the first piece inside reports 0 against the group while the
    // frame around it is placed against the stage. Two origins, one number.
    const stage = node(100, 100)
    const group = node(44, 12, stage)

    expect(placeIn(node(0, 0, group), stage)).toEqual({ left: 44, top: 12 })
  })

  it('stops where the chain does', () => {
    expect(placeIn(node(44, 12), node(0, 0))).toEqual({ left: 44, top: 12 })
  })
})

describe('bounds', () => {
  it('gives one piece its own box', () => {
    expect(bounds([{ left: 10, top: 20, width: 30, height: 40 }]))
      .toEqual({ left: 10, top: 20, width: 30, height: 40 })
  })

  it('gives several pieces the box that contains them all', () => {
    const box = bounds([
      { left: 100, top: 50, width: 100, height: 100 },
      { left: 0, top: 80, width: 50, height: 200 },
    ])

    expect(box).toEqual({ left: 0, top: 50, width: 200, height: 230 })
  })

  it('frames nothing when there is nothing to contain', () => {
    expect(bounds([])).toBeUndefined()
  })
})

describe('piecesNamed', () => {
  function stage(html: string) {
    const root = document.createElement('div')
    root.innerHTML = html
    return root
  }

  it('finds the pieces a deck named', () => {
    const root = stage('<div data-tf-name="proxy"></div><div data-tf-name="object"></div>')

    expect(piecesNamed(root, ['object', 'proxy']).map(el => el.dataset.tfName))
      .toEqual(['object', 'proxy'])
  })

  it('passes over a name nothing on the stage answers to', () => {
    const root = stage('<div data-tf-name="proxy"></div>')

    expect(piecesNamed(root, ['proxy', 'sandbox'])).toHaveLength(1)
  })

  it('takes a name as a name rather than as a selector', () => {
    const root = stage('<div data-tf-name="the &quot;proxy&quot;"></div>')

    expect(piecesNamed(root, ['the "proxy"'])).toHaveLength(1)
  })
})
