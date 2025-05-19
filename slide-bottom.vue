<template>
  <div class="sidebar">
    <img :src="logoSrc" class="logo" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { resolveAssetUrl } from "./LayoutHelper";

const logoSrc = computed(() => resolveAssetUrl("/logo.svg"));
</script>
