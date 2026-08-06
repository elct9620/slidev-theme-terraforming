<!--
  Two axes read at once, which is what shows a combination rather than a winner on any
  single measure.

    <Map2D x-start="Hard to use" x-end="Easy to use"
           y-start="Weak isolation" y-end="Strong isolation"
           :steps="[null, 'wasm']">
      <Point :x="88" :y="4">eval</Point>
      <Point name="wasm" :x="66" :y="80" tone="gunJyo">WebAssembly</Point>
    </Map2D>

  The marks are written as children because their labels are what the audience reads. The
  axes stay props: they name the space the marks are read in rather than anything plotted
  in it.

  There are no ticks — the chart is an argument about where things sit in relation to each
  other, and printed coordinates would be taken for measurements. Units mark the ends
  only. The stage is a fixed height and marks are placed by percentage, so adding or
  removing one leaves the rest where the audience last saw them.

  `steps` says which mark the frame sits on at each click, by name, and the slide learns
  its length from it. A `null` entry frames nothing. `active` is the alternative, for a
  chart driven from a `$clicks` expression: it takes the mark's place, -1 for none.
  `steps` wins when both are given.

  `reveal` hands the pacing to the speaker instead — one mark per click, before whatever
  `steps` goes on to do.
-->
<script setup lang="ts">
import { providePlot } from '../composables/chart'

const props = defineProps<{
  xStart: string
  xEnd: string
  yStart: string
  yEnd: string
  steps?: (string | null)[]
  active?: number
  reveal?: boolean
}>()

providePlot(() => props.steps, () => props.active, () => props.reveal)
</script>

<template>
  <div class="tf-map">
    <div class="tf-map-units">
      <span class="tf-map-end">{{ yEnd }}</span>
      <span class="tf-map-end">{{ yStart }}</span>
    </div>

    <div class="tf-map-stage">
      <span class="tf-map-end tf-map-end--x-left">{{ xStart }}</span>
      <span class="tf-map-end tf-map-end--x-right">{{ xEnd }}</span>

      <slot />
    </div>
  </div>
</template>
