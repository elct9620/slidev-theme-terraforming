<!--
  The narration under a diagram, saying what the current state means.

  Its height is fixed at two lines so that stepping through the narration never moves
  the diagram above it.

  A caption that says one thing says it directly; a caption that says something new at
  each click writes a `Line` for each, and the page learns its length from them:

    <Caption>
      <Line>The real object lives on the far side.</Line>
      <Line>Calling the proxy sends the request across the wire.</Line>
    </Caption>
-->
<script setup lang="ts">
import { provideTurns } from '../composables/turns'

provideTurns()
</script>

<template>
  <div class="tf-caption">
    <slot />
  </div>
</template>
