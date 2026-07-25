<!--
  Arranges the pieces of one diagram along an axis.

  Direction and spacing are all it decides. `gap` is the control worth reaching for
  while composing a page: the pieces keep the size the design file gives them and the
  breathing room between them is what adapts to how many there are.

  Because block sizes are fixed, a row holds about four blocks before it runs past the
  content width. Reaching that limit is a signal to say less on the page — `column`,
  or splitting across two pages, keeps every block the size the design file gives it.
  `fit` is the escape hatch for the page where neither applies: it measures the row
  and scales it down only when it would otherwise overflow, at the cost of that page's
  blocks no longer matching the rest of the deck.
-->
<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { useMeasured } from '../composables/measure'
import { StageKey, StagePlaceKey } from '../composables/stage'

const props = defineProps<{
  column?: boolean
  gap?: string
  fit?: boolean
}>()

const frame = ref<HTMLElement>()
const stage = ref<HTMLElement>()
const scale = ref(1)

provide(StageKey, stage)

// Pieces take their place as they set themselves up, which is the order they are
// written in — the same order the arrangement is read in.
let places = 0
provide(StagePlaceKey, () => places++)

// offsetWidth reports the pre-transform layout size, so the measurement stays stable
// whatever scale is already applied and cannot oscillate between two values.
function measure() {
  if (!props.fit || !frame.value || !stage.value)
    return

  const available = frame.value.clientWidth
  const natural = stage.value.offsetWidth

  scale.value = available > 0 && natural > available ? available / natural : 1
}

// Watched whether or not this stage fits, so that one told to fit after it was mounted is
// already being followed. A stage that never fits pays for an observer whose readings it
// throws away, which is cheaper than the page where the scaling silently never happened.
const remeasure = useMeasured(() => [frame.value, stage.value], measure)

watch(() => props.fit, remeasure)
</script>

<template>
  <div ref="frame" class="tf-stage-frame">
    <div
      ref="stage"
      class="tf-stage"
      :class="{ 'tf-stage--column': column }"
      :style="{
        gap,
        ...(fit && scale !== 1 ? { transform: `scale(${scale})` } : {}),
      }"
    >
      <slot />
    </div>
  </div>
</template>
