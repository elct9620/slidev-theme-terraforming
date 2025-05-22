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
  gap: 2rem;
}

.avatar {
  width: 8rem;
  border-radius: 50%;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;

  text-align: left;
}

.name {
  margin-left: -0.5rem;

  font-family: 'Senobi-Gothic', sans-serif;
  font-size: 3rem;
}

.title {
  margin-top: -0.5rem;

  font-size: 1.5rem;
  text-transform: uppercase;
}

.extra {
  font-size: 1.25rem;
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
