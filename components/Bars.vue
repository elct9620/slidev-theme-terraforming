<!--
  A bar chart in the same vocabulary as the flow diagrams: right-angled fills, a
  same-hue shadow, and a red frame marking the row under discussion. There is one
  movement only: the frame travels down the chart.

  `steps` says which row the frame sits on at each click, by label, and the slide
  learns its length from it — so the walk is stated once and adding a row renumbers
  nothing. A `null` entry frames no row:

    <Bars :steps="[null, 'WebAssembly', 'Container']" :items="[...]" />

  `active` is the alternative, for a chart driven from a `$clicks` expression: it
  takes the row's index, -1 for none. `steps` wins when both are given.

  The rows arrive top to bottom when the slide is reached, so the chart is read in
  order rather than met all at once. `reveal` hands that pacing to the speaker
  instead — one row per click, before whatever `steps` goes on to do.

  Each item's `value` sets the length and `text` is the figure to be read aloud,
  units included. `via` is the annotation that explains how the figure came about.

  `log` is for data spanning several orders of magnitude. On a linear axis the
  smallest bars all bottom out at the same minimum width and appear to be the same
  size, which reads as a claim the data does not make. Using it obliges you to label
  both ends of the axis, since lengths on a log scale otherwise invite a linear
  reading.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { barScale, useHighlight } from '../composables/chart'
import { useArriving, useReveal } from '../composables/entrance'

const props = defineProps<{
  items: { label: string, value: number, text: string, via?: string }[]
  max?: number
  steps?: (string | null)[]
  active?: number
  reveal?: boolean
  log?: boolean
  axisStart?: string
  axisEnd?: string
}>()

const arriving = useArriving()
const held = useReveal(() => props.items.length, () => props.reveal)

const current = useHighlight(
  () => props.items.map(item => item.label),
  () => props.steps,
  () => props.active,
)

const width = computed(() => barScale(
  props.items.map(item => item.value),
  { max: props.max, log: props.log },
))
</script>

<template>
  <div class="tf-bars">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="tf-bar-row"
      :class="{ 'is-active': current === i }"
      :data-tf-enter="!reveal && arriving || undefined"
      :data-tf-held="held(i) || undefined"
      :style="{ '--tf-enter-place': i }"
    >
      <span class="tf-bar-label">{{ item.label }}</span>
      <span class="tf-bar-via">{{ item.via }}</span>
      <span class="tf-bar-track">
        <span
          class="tf-bar-fill"
          :class="{ 'tf-bar-fill--log': log }"
          :style="{ width: width(item.value) }"
        />
      </span>
      <span class="tf-bar-value">{{ item.text }}</span>
    </div>

    <div v-if="axisStart || axisEnd" class="tf-bar-axis">
      <span>{{ axisStart }}</span>
      <span>{{ axisEnd }}</span>
    </div>
  </div>
</template>
