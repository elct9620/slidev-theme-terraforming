<!--
  One line of narration.

  Write one for each thing the speaker says about a figure and they are taken in turn, a
  click apart, so the walk through a diagram is written where it is read. All of them
  occupy the same place, so the line fades from one to the next rather than cutting.
-->
<script setup lang="ts">
import { useTurn } from '../composables/turns'

const { isCurrent } = useTurn('line')
</script>

<template>
  <span class="tf-caption-line" :class="{ 'is-off': !isCurrent }">
    <slot />
  </span>
</template>
