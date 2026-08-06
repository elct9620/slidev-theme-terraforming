<!--
  One measurement on a Bars chart, written where it is read.

  What the bar is of is the content; the rest qualifies that one datum. `value` is what
  sets the length and `text` is the figure to be read aloud, units included, since how
  precisely a number should be said is an editorial choice and not something to derive.
  `via` is the annotation saying how the figure came about, the second line a Block's
  `sub` is. `name` is how the chart's `steps` refers to this row, the way a Block's does.

  A bar has no length of its own: it is a share of the track, which cannot be known until
  every other bar has said how long it is. It asks the chart, and the chart answers from
  everything it has collected.
-->
<script setup lang="ts">
import { usePlot } from '../composables/chart'

const props = defineProps<{
  value: number
  text: string
  via?: string
  name?: string
}>()

const { place, isCurrent, isHeld, arriving, width } = usePlot(() => props.name, () => props.value)
</script>

<template>
  <div
    class="tf-bar-row"
    :class="{ 'is-active': isCurrent }"
    :data-tf-enter="arriving || undefined"
    :data-tf-held="isHeld || undefined"
    :data-tf-name="name"
    :style="{ '--tf-enter-place': place }"
  >
    <span class="tf-bar-label"><slot /></span>
    <span class="tf-bar-via">{{ via }}</span>
    <span class="tf-bar-track">
      <span class="tf-bar-fill" :style="{ width }" />
    </span>
    <span class="tf-bar-value">{{ text }}</span>
  </div>
</template>
