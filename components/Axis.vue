<!--
  A single line spanning the content width with a meaning at each end, for when the
  row above it is a continuous spectrum rather than a set of exclusive options.

  The stroke is the same one a Stroke draws, so the spectrum reads as part of the same
  visual language as the diagrams around it.
-->
<script setup lang="ts">
import Stroke from './Stroke.vue'

defineProps<{
  startLabel: string
  endLabel: string
}>()
</script>

<template>
  <div class="tf-axis">
    <Stroke dir="both" />
    <div class="tf-axis-ends">
      <span class="tf-axis-end">{{ startLabel }}</span>
      <span class="tf-axis-end">{{ endLabel }}</span>
    </div>
  </div>
</template>
