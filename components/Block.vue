<!--
  A flat block of colour — the unit every flow diagram is built from.

  `color` names a palette entry rather than a role, because what a colour stands for
  belongs to the deck: one talk's yellow is a proxy, another's is a warning. Stating
  the meaning is the narration's job, not the component's.

  `name` is how a Focus refers to this block. Naming rather than counting means a
  block can be inserted anywhere without renumbering what points at the others.

  `hidden` withholds the block without giving up its place in the row.
  `sub` is the second line of text, one step smaller.
-->
<script setup lang="ts">
defineProps<{
  color?: 'gunJyo' | 'tamago' | 'jinZamOmi' | 'gray'
  name?: string
  hidden?: boolean
  sub?: string
}>()
</script>

<template>
  <div
    class="tf-block"
    :data-tf-color="color ?? 'gunJyo'"
    :data-tf-hidden="hidden || undefined"
    :data-tf-name="name"
  >
    <span><slot /></span>
    <span v-if="sub" class="tf-block-sub">{{ sub }}</span>
  </div>
</template>
