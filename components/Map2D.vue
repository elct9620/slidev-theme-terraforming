<!--
  Two axes read at once, which is what shows a combination rather than a winner on
  any single measure.

  `x` and `y` are relative positions from 0 to 100 and there are no ticks: the chart
  is an argument about where things sit in relation to each other, and printed
  coordinates would be taken for measurements. Units mark the ends only.

  The stage is a fixed height and points are placed by percentage, so adding or
  removing a point leaves the rest where the audience last saw them.

  `steps` says which point the frame sits on at each click, by label, and the slide
  learns its length from it. A `null` entry frames no point:

    <Map2D :steps="[null, 'WebAssembly']" :points="[...]" />

  `active` is the alternative, for a chart driven from a `$clicks` expression: it
  takes the point's index, -1 for none. `steps` wins when both are given.

  The points arrive in the order they are listed when the slide is reached, so the
  chart is built up rather than met all at once. `reveal` hands that pacing to the
  speaker instead — one point per click, before whatever `steps` goes on to do.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useArriving, useReveal } from '../composables/entrance'
import { useSteps } from '../composables/steps'

const props = defineProps<{
  xStart: string
  xEnd: string
  yStart: string
  yEnd: string
  points: { label: string, x: number, y: number, tone?: 'gunJyo' | 'gray' }[]
  steps?: (string | null)[]
  active?: number
  reveal?: boolean
}>()

const step = useSteps(() => props.steps)
const arriving = useArriving()
const held = useReveal(() => props.points.length, () => props.reveal)

// Naming a point that is not there leaves the chart unframed rather than throwing, the
// same answer an out-of-range `active` already gave.
const current = computed(() => props.steps
  ? props.points.findIndex(point => point.label === step.value)
  : props.active ?? -1)

// Points near either end anchor by their near edge so the label stays on the chart;
// everything in between reads better centred on its position.
function anchor(x: number) {
  if (x <= 12)
    return 'tf-map-point--start'
  if (x >= 88)
    return 'tf-map-point--end'
  return ''
}
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

      <span
        v-for="(point, i) in points"
        :key="point.label"
        class="tf-map-point"
        :class="[
          `tf-map-point--${point.tone ?? 'gray'}`,
          anchor(point.x),
          { 'is-active': current === i },
        ]"
        :data-tf-enter="!reveal && arriving || undefined"
        :data-tf-held="held(i) || undefined"
        :style="{ left: `${point.x}%`, bottom: `${point.y}%`, '--tf-enter-place': i }"
      >{{ point.label }}</span>
    </div>
  </div>
</template>
