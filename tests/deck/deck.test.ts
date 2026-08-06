/**
 * The fixture deck, driven through Slidev's own server in a real browser.
 *
 * This is the level the unit suite cannot reach. A component declares a length; Slidev
 * resolves every declaration on a page into the number of steps the speaker actually
 * walks, and the frontmatter can override the lot. Nothing about getting that wrong shows
 * on the slide — a page simply advances one step too few, and the last thing the narration
 * had to say is never reached.
 *
 * Every wait here is on something Slidev says about itself rather than on a duration.
 * `clicksContext.isMounted` is the signal that a page's own registrations are in, which is
 * the moment its length means anything.
 */
import type { Browser, Page } from 'playwright-chromium'
import type { ViteDevServer } from 'vite'
import { createServer, resolveOptions } from '@slidev/cli'
import { chromium } from 'playwright-chromium'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let server: ViteDevServer
let browser: Browser
let page: Page
let url: string

beforeAll(async () => {
  const options = await resolveOptions({ entry: 'example.md' }, 'dev')
  server = await createServer(options, {
    server: { port: 0, host: '127.0.0.1' },
    logLevel: 'warn',
  })
  await server.listen()
  url = server.resolvedUrls!.local[0]

  browser = await chromium.launch()
  page = await browser.newPage()
})

afterAll(async () => {
  await browser?.close()
  await server?.close()
})

/** Waits for the deck to be running, not merely served. */
async function open(path: string) {
  await page.goto(`${url}${path}`)
  await page.waitForFunction(() => (window as any).__slidev__?.nav?.total > 0)
}

/** Goes to a slide and waits until it has finished saying how long it is. */
async function show(no: number) {
  await page.evaluate(n => (window as any).__slidev__.nav.go(n), no)
  await page.waitForFunction((n) => {
    const { nav } = (window as any).__slidev__
    return nav.currentSlideNo === n && nav.clicksContext.isMounted
  }, no)
}

describe('the fixture deck', () => {
  it('gives every page the length its own content asks for', async () => {
    await open('1')

    const total = await page.evaluate(() => (window as any).__slidev__.nav.total)
    const walked: Record<number, number> = {}

    for (let no = 1; no <= total; no++) {
      await show(no)

      const clicks = await page.evaluate(() => (window as any).__slidev__.nav.clicksContext.total)
      if (clicks > 0)
        walked[no] = clicks
    }

    // The pages that take more than one step, and how many. A page dropping out of this
    // list is a narration that lost the clicks it was written against.
    expect(walked).toMatchInlineSnapshot(`
      {
        "11": 3,
        "12": 2,
        "13": 2,
        "15": 2,
        "16": 3,
        "17": 3,
        "19": 3,
        "2": 1,
        "20": 2,
        "21": 1,
      }
    `)
  })

  // Page 14 is a figure with nothing to step through, and that combination is the whole
  // point: a page carrying clicks is already safe, because printing winds them past the
  // end of the slide and a figure reads that as spoken for. A page with none of them is
  // the one an export can photograph halfway through its arrival — the exporter makes
  // each page the one on screen in turn, which is exactly the signal an arrival waits for.
  // The two assertions before the counts are what keep this from passing on a page that
  // has drifted into having clicks, or into having no figures left to hold back.
  const stillPage = 14

  it('shows a figure whole on a page being printed, even with nothing to step through', async () => {
    await open(`${stillPage}?print`)

    // Printing renders the whole deck at once, and each slide's content arrives as a
    // module of its own, so the deck is only all there once the fetching has stopped.
    await page.waitForFunction(() =>
      document.querySelectorAll('[data-slidev-no]').length === (window as any).__slidev__.nav.total)
    await page.waitForLoadState('networkidle')

    const printed = await page.evaluate((no) => {
      const { nav } = (window as any).__slidev__
      return {
        printMode: nav.isPrintMode,
        onScreen: nav.currentSlideNo,
        clicks: nav.clicksContext.total,
        figures: document.querySelectorAll(`[data-slidev-no="${no}"] .tf-block`).length,
        arriving: document.querySelectorAll('[data-tf-enter]').length,
        held: document.querySelectorAll('[data-tf-held]').length,
      }
    }, stillPage)

    expect(printed.printMode).toBe(true)
    expect(printed.onScreen).toBe(stillPage)
    expect(printed.clicks).toBe(0)
    expect(printed.figures).toBeGreaterThan(0)

    // A page is captured on a timer rather than after the motion on it has run its
    // course, so nothing anywhere in the deck may be on its way somewhere.
    expect(printed.arriving).toBe(0)
    expect(printed.held).toBe(0)
  })
})
