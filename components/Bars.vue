<!--
  A bar chart in the same vocabulary as the flow diagrams: right-angled fills, a same-hue
  shadow, and a red frame marking the row under discussion. There is one movement only:
  the frame travels down the chart.

    <Bars log axis-start="1 μs" axis-end="10 ms" :steps="[null, 'wasm']">
      <Bar :value="1200" text="1.2 ms" via="fork">Process</Bar>
      <Bar name="wasm" :value="12" text="12 μs" via="linear memory">WebAssembly</Bar>
    </Bars>

  The rows are written as children because what each is of is what the audience reads.
  What this component holds is what it decides for the whole: the ceiling the bars are
  measured against, which row the frame is on, how the reading is paced.

  `steps` says which row the frame sits on at each click, by name, and the slide learns
  its length from it — so the walk is stated once and adding a row renumbers nothing. A
  `null` entry frames no row. `active` is the alternative, for a chart driven from a
  `$clicks` expression: it takes the row's place, -1 for none. `steps` wins when both are
  given.

  The rows arrive top to bottom when the slide is reached, so the chart is read in order
  rather than met all at once. `reveal` hands that pacing to the speaker instead — one row
  per click, before whatever `steps` goes on to do.

  `max` measures the bars against a stated ceiling rather than against the longest of
  them, which is what lets two charts be compared.

  `log` is for data spanning several orders of magnitude. On a linear axis the smallest
  bars all bottom out at the same minimum width and appear to be the same size, which
  reads as a claim the data does not make. Using it obliges you to label both ends of the
  axis, since lengths on a log scale otherwise invite a linear reading.
-->
<script setup lang="ts">
import { providePlot } from '../composables/chart'

const props = defineProps<{
  max?: number
  steps?: (string | null)[]
  active?: number
  reveal?: boolean
  log?: boolean
  axisStart?: string
  axisEnd?: string
}>()

providePlot({
  steps: () => props.steps,
  active: () => props.active,
  reveal: () => props.reveal,
  scale: () => ({ max: props.max, log: props.log }),
})
</script>

<template>
  <div class="tf-bars" :class="{ 'tf-bars--log': log }">
    <slot />

    <div v-if="axisStart || axisEnd" class="tf-bar-axis">
      <span>{{ axisStart }}</span>
      <span>{{ axisEnd }}</span>
    </div>
  </div>
</template>
