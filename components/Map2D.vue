<!--
  Two axes read at once, which is what shows a combination rather than a winner on
  any single measure.

  `x` and `y` are relative positions from 0 to 100 and there are no ticks: the chart
  is an argument about where things sit in relation to each other, and printed
  coordinates would be taken for measurements. Units mark the ends only.

  The stage is a fixed height and points are placed by percentage, so adding or
  removing a point leaves the rest where the audience last saw them.
-->
<script setup lang="ts">
defineProps<{
  xStart: string
  xEnd: string
  yStart: string
  yEnd: string
  points: { label: string, x: number, y: number, tone?: 'gunJyo' | 'gray' }[]
  active?: number
}>()

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
          { 'is-active': active === i },
        ]"
        :style="{ left: `${point.x}%`, bottom: `${point.y}%` }"
      >{{ point.label }}</span>
    </div>
  </div>
</template>
