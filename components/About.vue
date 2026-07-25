<!--
  The speaker introduction: portrait, name, role, and whatever contact lines the deck
  passes through the slot.

  The three text sizes are the top three steps of the type scale, so the introduction
  is proportioned by the same system as every other page rather than by its own set
  of numbers.
-->
<script setup lang="ts">
import portrait from '../assets/avatar.png'

withDefaults(defineProps<{
  avatar?: string
  name?: string
  title?: string
}>(), {
  avatar: portrait,
  name: '蒼時弦也',
  title: 'Software Architect',
})
</script>

<template>
  <div class="tf-about">
    <img :src="avatar" :alt="name" class="tf-about-portrait">
    <div class="tf-about-lines">
      <h1 class="tf-about-name">
        {{ name }}
      </h1>
      <h2 class="tf-about-title">
        {{ title }}
      </h2>
      <div class="tf-about-extra">
        <slot />
      </div>
    </div>
  </div>
</template>
