# Slidev Theme - Terraforming

[![NPM version](https://img.shields.io/npm/v/@aotoki/slidev-theme-terraforming?color=3AB9D4&label=)](https://www.npmjs.com/package/@aotoki/slidev-theme-terraforming)

A personal theme for [Slidev](https://github.com/slidevjs/slidev) by Aotokitsuruya.

## Install

Add the following frontmatter to your `slides.md`. Start Slidev then it will prompt you to install the theme automatically.

<pre><code>---
theme: <b>'@aotoki/slidev-theme-terraforming'</b>
---</code></pre>

Learn more about [how to use a theme](https://sli.dev/guide/theme-addon#use-theme).

## Canvas

The theme draws on a **1920×1080** canvas, matching the design file it is derived from.
A deck can go back to another size from its own headmatter:

```yaml
---
canvasWidth: 980
---
```

The root font size is 16px, so a px measurement from the design file divided by 16 is
its rem value, and divided by 4 is its UnoCSS spacing number — 72px is `p-18`.

Mermaid sizes its diagrams from its own text metrics, so its base type is set to the
body step to keep a diagram proportionate to the canvas. An individual block can still
take `{scale: n}` when it needs to be larger or smaller than that.

## Transition

Slides cross over with `tf-fade`, the theme's own transition. Only the content fades:
the sidebar is the same on every slide, so fading the whole page would dissolve it
into an identical copy of itself and put motion in the one part of the canvas that
never changes. It runs for `--slidev-transition-duration`, the same variable Slidev's
own transitions read.

A deck can name any of Slidev's builtins instead:

```yaml
---
transition: slide-left
---
```

Note that the builtins fade or slide the whole page, sidebar included.

## Design Tokens

Tokens are defined in two layers in `styles/tokens.css`. The first layer names values
for what they are, using the Tailwind v4 `@theme` namespaces:

| Namespace      | Tokens                                                         |
|----------------|----------------------------------------------------------------|
| `--color-*`    | `kon-500` `gunJyo-500` `tamago-500` `jinZamOmi-500` `gray-200` `gray-500` `white` `black` |
| `--text-*`     | `title` 64 · `heading` 48 · `body` 36 · `sub` 32 · `note` 16    |
| `--leading-*`  | `none` 1 · `heading` 1.25 · `body` 1.5                          |
| `--font-*`     | `sans` `mono`                                                   |
| `--tf-motion-*`| `travel` 600ms · `settle` 500ms · `touch` 200ms · `delay` 300ms · `stagger` 100ms · `ease-move` · `ease-fade` · `rise` 20 |
| `--spacing-*`  | `line` 5 · `shadow` 10 · `sidebar` 296 · `slash` 100 · `block-w` 270 · `block-h` 162 |
| `--container-*`| `content` 1380                                                  |

Leading answers a question about the text rather than about its size. `none` is for a
line laid out as a single line, where the line box has to equal the type size for the
box around it to measure out; `body` is for anything that may wrap; `heading` sits
between and hands the extra back through a negative margin, so a one-line heading
still lands where the design file's 100% put it. Space between blocks is always a
margin, never leading.

The second layer names them for the role they play: `--slidev-theme-primary`,
`--slidev-theme-secondary`, `--slidev-theme-accent`, `--slidev-theme-neutral`,
`--slidev-theme-text`, `--slidev-theme-surface`, `--slidev-theme-on-surface`.

Both layers are wired into the UnoCSS theme, so slides can use them as utilities:

```html
<div class="bg-gunJyo-500 text-white text-sub p-8">A block of 群青</div>
<p class="text-note text-neutral">A source link</p>
```

The utilities emit `var()` references rather than literals, so overriding a token in a
deck's own `style.css` changes both the stylesheet and the utilities:

```css
:root {
  --color-gunJyo-500: #3a8fc4;
}
```

### Fonts

The sans stack lives in `--font-sans` and resolves to locally installed faces, so no
webfont is fetched for it:

- [Futura](https://zh.wikipedia.org/zh-tw/Futura) / [Futura PT](https://fonts.adobe.com/fonts/futura-pt) for Latin
- PingFang TC / LiHei Pro / Heiti TC / Microsoft JhengHei for CJK

Fetched from Google Fonts:

- JetBrains Mono for code

Bundled with the theme:

- [Senobi Gothic](https://modi.jpn.org/font_senobi.php) for the name in `About`

Loaded from a CDN when Mermaid is used:

- [Excalifont](https://plus.excalidraw.com/excalifont) and [XiaolaiSC](https://github.com/lxgw/kose-font)

## Layouts

- `default` — content starts at the top edge
- `cover`
- `intro`
- `section`
- `statement`
- `center` — centred vertically, text centred
- `diagram` — centred on both axes, for a page whose content is the figure itself

## Components

### About

The speaker introduction.

```html
<About name="蒼時弦也" title="Software Architect">
https://blog.aotoki.me/<br />
@elct9620
</About>
```

### Diagram vocabulary

Every diagram is built from four ideas — a flat fill, a focus frame, a drawn stroke,
and absence expressed as opacity. Nothing scales or bolds, so a figure can animate
across clicks without the layout shifting underneath it.

| Component | Props |
|-----------|-------|
| `Stage`   | `column`, `gap`, `fit` |
| `Block`   | `color` (`gunJyo` \| `tamago` \| `jinZamOmi` \| `gray`), `name`, `sub`, `hidden` |
| `Group`   | `name`, `column`, `gap`, `hidden` |
| `Stroke`  | `dir` (`right` \| `left` \| `both` \| `up` \| `down` \| `both-y` \| `none`), `label`, `labels`, `name`, `flip`, `length`, `hidden` |
| `Focus`   | `steps`, `of`, `color` |
| `Caption` | — |

`Focus` is the selection box. It is positioned absolutely and takes no space, so it
never disturbs what it frames, and it transitions its position and size rather than
fading — moving the focus reads as one rectangle travelling and resizing.

Name the pieces and let `steps` say what the frame holds at each click. Several names
give the box that contains them all, so neighbours read as a range; `null` frames
nothing, which is how the box waits offstage until the click it belongs to. There are
no coordinates and no indices, so inserting a block renumbers nothing.

```html
<Stage>
  <Block name="proxy" color="tamago">Proxy</Block>
  <Stroke :label="$clicks === 1 ? 'call' : ''" :labels="['call', 'result']" />
  <Block name="object" color="gunJyo">Object</Block>

  <Focus :steps="['proxy', ['proxy', 'object']]" />
</Stage>

<Caption>The real <strong>object</strong> lives on the far side.</Caption>
```

The list is what tells the slide how long it is — see [Clicks](#clicks) — so the walk
through a diagram is written in one place instead of being split between a frontmatter
count and a chain of comparisons. Entries are addressed by absolute click number, so
`steps[0]` is the state before the first click.

`of` is the alternative, for a box driven from a `$clicks` expression of your own. It
takes the same names as one entry of `steps` and the page then has to declare its own
clicks. To frame something the stage does not own, leave both out and place the box by
hand — Slidev's `v-drag` can position it in the preview and write the result back into
the markdown:

```html
<Focus v-drag="[420, 180, 660, 220]" />
```

`Stroke` takes its length from the widest entry in `labels`, so changing or clearing
the label never resizes the line. Supply `labels` whenever the text changes across
clicks. It is drawn as SVG so its weight survives any transform the slide applies;
Slidev's own `<Arrow>` remains available for annotating a slide by coordinates.

`Stage` spaces its pieces with `gap` — the pieces keep the size the design file gives
them and the breathing room is what adapts. A row holds about four blocks before it
runs past the content width; past that, prefer `column` or a second page. `fit` is an
escape hatch that scales one stage down to fit, at the cost of that page's blocks no
longer matching the rest of the deck.

### Charts

| Component | Props |
|-----------|-------|
| `Bars`    | `items` (`{ label, value, text, via? }[]`), `max`, `steps`, `active`, `log`, `axisStart`, `axisEnd` |
| `Axis`    | `startLabel`, `endLabel` |
| `Map2D`   | `xStart`, `xEnd`, `yStart`, `yEnd`, `points` (`{ label, x, y, tone? }[]`), `steps`, `active` |

Both charts take the same red frame as a block, and move it with `steps` the way a
`Focus` does — each entry naming the row or point under discussion, `null` for none:

```html
<Bars
  :steps="[null, 'WebAssembly', 'Container']"
  :items="[
    { label: 'Container', value: 220, text: '220 μs' },
    { label: 'WebAssembly', value: 12, text: '12 μs' },
  ]"
/>
```

`active` is the alternative for a chart driven from a `$clicks` expression, taking the
row's index and -1 for none.

`Bars` accepts `log` for data spanning orders of magnitude; using it obliges you to
label both ends of the axis, since lengths on a log scale otherwise invite a linear
reading. Rows are laid out in fixed columns so entries line up down the chart; the
annotation column collapses when no row carries a `via`. Override `--tf-bar-label-w`
or `--tf-bar-via-w` on `.tf-bars` for longer text.

## Arrival

A figure's pieces land in the order they are read rather than all at once, so the
narration has a moment on each before the next one arrives. A `Stage` deals its
pieces out along the row; `Bars` and `Map2D` deal out their rows and points. A `Group`
arrives whole — it exists so that several pieces read as one thing.

Nothing is asked of the deck: the arrival plays when the slide is reached, and the
first click ends it — asking for the next step says you are past being shown the
slide, so whatever is still on its way is simply there. Export and print show every
figure whole; nothing arrives on a page being captured on a timer.

The focus frame waits for the pieces it frames, since a frame around a space nothing
has arrived in reads as a mistake rather than as emphasis.

`reveal` hands the pacing to the speaker instead, one row or point per click:

```html
<Bars reveal :items="[...]" />
```

The prop is on the charts alone because they own their pieces. A `Stage`'s pieces are
written by the deck, so a deck paces those with `v-click` or `hidden` — see
[Clicks](#clicks).

### Motion

How long a change takes is a question about the change rather than about what is
changing, so there are three answers and every rule in the theme picks one. The
lengths are [Material 3's duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
rather than numbers chosen by eye; a slide is read from further away and with less
urgency than an interface, so each takes the slower end of what M3 offers.

| Token | | |
|-------|--|--|
| `--tf-motion-travel`  | 600ms · M3 `long4`  | something moving or resizing, which has ground to cover — the focus frame crossing a diagram, the red frame stepping down a chart |
| `--tf-motion-settle`  | 500ms · M3 `long2`  | something arriving or leaving in place, which has none. Slidev's slide transition follows it |
| `--tf-motion-touch`   | 200ms · M3 `short4` | direct feedback to the pointer, where anything slower reads as lag |
| `--tf-motion-delay`   | 300ms · M3 `medium2` | how long a figure waits before arriving, so it does not run while the page is still fading in |
| `--tf-motion-stagger` | 100ms · M3 `short2` | the wait between one arriving piece and the next |
| `--tf-motion-rise`    | 20 | how far an arriving piece travels — set it to 0 for a plain fade |

There are two curves, because a curve describes how ground is covered and not every
change covers any:

| Token | | |
|-------|--|--|
| `--tf-motion-ease-move` | M3 `emphasized.decelerate` | position, size, the rise a piece makes — off the mark quickly and then settling, so it reads as coming to rest where it belongs |
| `--tf-motion-ease-fade` | `ease-in-out` | opacity and colour, which have no ground to cover. The move curve spends a fade in a twentieth of the time it was given, so the duration stops meaning anything |

They reach UnoCSS too, so motion a deck adds itself keeps time with the theme's:
`duration-travel`, `duration-settle`, `duration-touch`, `ease-move`, `ease-fade`.

## Clicks

Slidev works out how long a slide is from what registers with it — `v-click`,
`v-clicks`, `v-switch`, `v-click-gap` — while reading `$clicks` in an expression
registers nothing. Slidev's own `v-motion` reads clicks the same way, so this is the
division of labour rather than an oversight in it.

`steps` puts a component on the declaring side: giving one to a `Focus`, `Bars` or
`Map2D` is enough on its own, and a page whose only content is that figure will walk
through every entry before moving on.

Anything driven from a `$clicks` expression — `of`, `active`, `hidden`, a `Stroke`'s
`label` — only reads, so a page built that way has to say how long it is. Often a
`v-switch` in the narration already covers it; otherwise the frontmatter says so:

```yaml
---
clicks: 3
---
```

That count *overrides* every registration on the page rather than adding to it, so a
slide already carrying `steps` should leave it out — declaring both cuts the slide to
whatever the frontmatter says.

## Contributing

- `pnpm install`
- `pnpm dev` to preview `example.md`, which exercises every layout and component
- `pnpm test` for the click and arrival protocols, `pnpm test:watch` while working on them
- `pnpm typecheck` for the theme's own files
- `pnpm export` to generate the preview PDF
- `pnpm screenshot` to generate the preview PNG

What a test can answer here stops short of what a slide looks like: the suite covers the
parts that fail silently — a component declaring the wrong length, a figure deciding it
should be arriving — while how a rule cascades and how long a transition takes are still
read off a running deck.

`package.json` lists what ships. A new file at the top level that Slidev is meant to load
has to be added there, or it will be missing from the published package while working
perfectly in this repository.
