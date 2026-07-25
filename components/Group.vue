<!--
  Binds several pieces into one arrangement — a template and the instances that share
  it, a layer and everything inside it.

  Framing a group is the Focus's job, so a group only has to say how its contents sit
  together. Giving it a `name` lets a Focus point at the whole arrangement in one word
  instead of listing what it holds.

  It arrives whole for the same reason: what it holds is one thing, so its contents
  are not dealt out one at a time behind it.
-->
<script setup lang="ts">
import { provide } from 'vue'
import { useEntrance } from '../composables/entrance'
import { StagePlaceKey } from '../composables/stage'

defineProps<{
  name?: string
  column?: boolean
  gap?: string
  hidden?: boolean
}>()

const entrance = useEntrance()

provide(StagePlaceKey, null)
</script>

<template>
  <div
    class="tf-group"
    v-bind="entrance"
    :data-tf-column="column || undefined"
    :data-tf-hidden="hidden || undefined"
    :style="{ gap }"
    :data-tf-name="name"
  >
    <slot />
  </div>
</template>
