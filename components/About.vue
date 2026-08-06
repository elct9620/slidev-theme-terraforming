<!--
  The speaker introduction: a portrait, and beside it whatever the deck writes about the
  person — a `Name`, the `Title` they hold, the `Contact` lines they offer.

    <About>
      <Name>蒼時弦也</Name>
      <Title>Associate AI Engineer</Title>
      <Title>AI Engineer</Title>
      <Contact>https://blog.aotoki.me/</Contact>
      <Contact>@elct9620</Contact>
    </About>

  The lines are written rather than passed in, because they are what the audience reads.
  `avatar` stays a prop: a portrait is a resource the page is given, not something read
  off it.

  Where each line lands is the stylesheet's to say, so the deck writes them in the order
  they are read and several `Title`s share one place — see `useTurn`. Anything else the
  deck writes lands under them, which is how a fourth kind of line becomes possible
  without this component learning about it.

  The three text sizes are the top three steps of the type scale, so the introduction is
  proportioned by the same system as every other page rather than by its own set of
  numbers.
-->
<script setup lang="ts">
import portrait from '../assets/avatar.png'
import { provideTurns } from '../composables/turns'

// The portrait is described by the name written beside it, so it carries no alternative
// of its own; `alt` is there for the deck that puts a face beside no name at all.
withDefaults(defineProps<{
  avatar?: string
  alt?: string
}>(), {
  avatar: portrait,
  alt: '',
})

provideTurns()
</script>

<template>
  <div class="tf-about">
    <img :src="avatar" :alt="alt" class="tf-about-portrait">
    <div class="tf-about-lines">
      <slot />
    </div>
  </div>
</template>
