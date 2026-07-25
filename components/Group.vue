<!--
  Binds several pieces into one arrangement — a template and the instances that share
  it, a layer and everything inside it.

  Framing a group is the Focus's job, so a group only has to say how its contents sit
  together. Giving it a `name` lets a Focus point at the whole arrangement in one word
  instead of listing what it holds.
-->
<script setup lang="ts">
defineProps<{
  name?: string
  column?: boolean
  gap?: string
  hidden?: boolean
}>()
</script>

<template>
  <div
    class="tf-group"
    :data-tf-column="column || undefined"
    :data-tf-hidden="hidden || undefined"
    :style="{ gap }"
    :data-tf-name="name"
  >
    <slot />
  </div>
</template>
