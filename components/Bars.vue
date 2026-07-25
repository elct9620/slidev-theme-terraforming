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
import { useSteps } from '../composables/steps'

const props = defineProps<{
  items: { label: string, value: number, text: string, via?: string }[]
  max?: number
  steps?: (string | null)[]
  active?: number
  log?: boolean
  axisStart?: string
  axisEnd?: string
}>()

const step = useSteps(() => props.steps)

// Naming a row that is not there leaves the chart unframed rather than throwing, the
// same answer an out-of-range `active` already gave.
const current = computed(() => props.steps
  ? props.items.findIndex(item => item.label === step.value)
  : props.active ?? -1)

const values = computed(() => props.items.map(i => i.value))

// The annotation column exists for the whole chart or not at all, so that the bars
// start at the same offset whether or not a given row has something to annotate.
const annotated = computed(() => props.items.some(i => i.via))

// The log range is rounded out to powers of ten, with one extra decade below the
// smallest value so that the shortest bar still has a visible length.
const logMin = computed(() => Math.floor(Math.log10(Math.min(...values.value))) - 1)
const logMax = computed(() => Math.ceil(Math.log10(props.max ?? Math.max(...values.value))))
const linearMax = computed(() => props.max ?? Math.max(...values.value))

const width = (value: number) => {
  if (!props.log)
    return `${(value / linearMax.value) * 100}%`
  const ratio = (Math.log10(value) - logMin.value) / (logMax.value - logMin.value)
  return `${Math.max(ratio, 0) * 100}%`
}
</script>

<template>
  <div class="tf-bars">
    <div
      v-for="(item, i) in items"
      :key="item.label"
      class="tf-bar-row"
      :class="{ 'is-active': current === i }"
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
