<!--
  The speaker introduction: portrait, name, role, and whatever contact lines the deck
  passes through the slot.

  The three text sizes are the top three steps of the type scale, so the introduction
  is proportioned by the same system as every other page rather than by its own set
  of numbers.
-->
<template>
  <div class="container">
    <img :src="props.avatar" class="avatar" />
    <div class="info">
      <h1 class="name">{{ props.name }}</h1>
      <h2 class="title">{{ props.title }}</h2>
      <div class="extra">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
}

.avatar {
  width: 16rem;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  text-align: left;
}

/* Senobi Gothic sets the name. All three lines share one left edge, so the block
   reads as a single column regardless of whether the name is Latin or CJK. */
.name {
  margin: 0;

  font-family: 'Senobi Gothic', sans-serif;
  font-size: var(--text-title);
  line-height: var(--leading-none);
}

.title {
  margin: 1rem 0 0;

  font-size: var(--text-heading);
  line-height: var(--leading-none);
  text-transform: uppercase;
}

/* The contact lines are the one part a deck fills in, so they take the copy leading:
   whatever it puts here may run to several lines. */
.extra {
  margin-top: 1rem;

  font-size: var(--text-body);
  line-height: var(--leading-body);
  color: var(--slidev-theme-primary);
}
</style>

<script setup language="ts">
import avatar from "../assets/avatar.png";

const props = defineProps({
  avatar: {
    type: String,
    default: avatar,
  },
  name: {
    type: String,
    default: "蒼時弦也",
  },
  title: {
    type: String,
    default: "Software Architect",
  },
});
</script>
