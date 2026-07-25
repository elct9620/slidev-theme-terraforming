<!--
  A single line spanning the content width with a meaning at each end, for when the
  row above it is a continuous spectrum rather than a set of exclusive options.

  The stroke is the same one a Stroke draws, so the spectrum reads as part of the same
  visual language as the diagrams around it.

  The two ends are `start` and `end`, which is how every chart in the theme names them —
  a chart with more than one axis says which, as Map2D's `xStart` does, and one that is
  nothing but an axis needs no qualifier at all.
-->
<script setup lang="ts">
import Stroke from './Stroke.vue'

defineProps<{
  start: string
  end: string
}>()
</script>

<template>
  <div class="tf-axis">
    <Stroke dir="both" />
    <div class="tf-axis-ends">
      <span class="tf-axis-end">{{ start }}</span>
      <span class="tf-axis-end">{{ end }}</span>
    </div>
  </div>
</template>
