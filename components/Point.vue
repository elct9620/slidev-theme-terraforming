<!--
  One thing placed on a Map2D, written where it is read.

  `x` and `y` are relative positions from 0 to 100 — the chart is an argument about where
  things sit in relation to each other, so a mark states its position rather than a
  measurement. `tone` is what sets one apart from the field, and `name` is how a chart's
  `steps` refers to it, the way a Block's does.

  The marks arrive in the order they are written, so the chart is built up rather than
  met all at once.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { pointAnchor, usePlot } from '../composables/chart'

const props = defineProps<{
  x: number
  y: number
  name?: string
  tone?: 'gunJyo' | 'gray'
}>()

const { place, isCurrent, isHeld, arriving } = usePlot(() => props.name)

const anchor = computed(() => pointAnchor(props.x))
</script>

<template>
  <span
    class="tf-map-point"
    :class="[`tf-map-point--${tone ?? 'gray'}`, anchor, { 'is-active': isCurrent }]"
    :data-tf-enter="arriving || undefined"
    :data-tf-held="isHeld || undefined"
    :data-tf-name="name"
    :style="{ 'left': `${x}%`, 'bottom': `${y}%`, '--tf-enter-place': place }"
  ><slot /></span>
</template>
