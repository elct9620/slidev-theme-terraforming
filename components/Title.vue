<!--
  The role an introduction states.

  Write one for each role the talk gives the speaker and they are taken in turn, a click
  apart — for the talk that opens by saying what the speaker used to be. All of them are
  laid out in the same place, so the column is as wide as the longest of them and neither
  it nor the portrait beside it moves as the role changes.
-->
<script setup lang="ts">
import { useTurn } from '../composables/turns'

const { isCurrent } = useTurn('title')
</script>

<template>
  <h2 class="tf-about-title" :class="{ 'is-off': !isCurrent }">
    <slot />
  </h2>
</template>
