<!--
  A drawn line with a chevron, standing in for Figma's line tool.

  The mark itself is SVG. A chevron built from rotated CSS borders resamples badly the
  moment anything animates it — the arms thicken unevenly and the point frays —
  whereas a vector keeps its geometry through any transform the slide applies.

  Layout stays in the flow, though: the stroke occupies space and pushes its
  neighbours apart, which is what lets a row rearrange itself when a block is added.

  `dir` sets both the pointing and the axis: right / left / both are horizontal,
  up / down / both-y are vertical, none is a bare line.

  `label` is what the line says right now; `labels` is every caption this stroke will
  ever show. The line takes its length from the widest of them, so changing or
  clearing the label never resizes it and the row never shifts. Supply `labels`
  whenever the text changes across clicks; a single fixed caption can omit it.

  `flip` puts the label on the other side, and `length` is for a line that has to
  span a whole arrangement.

  A stroke on a stage arrives in its turn along the row, like the pieces it joins — a
  line drawn between two blocks that have not turned up yet has nothing to connect.
-->
<script setup lang="ts">
import { computed, inject } from 'vue'
import { useArriving } from '../composables/entrance'
import { StagePlaceKey } from '../composables/stage'

const props = defineProps<{
  dir?: 'right' | 'left' | 'both' | 'up' | 'down' | 'both-y' | 'none'
  label?: string
  labels?: string[]
  name?: string
  flip?: boolean
  length?: string
  hidden?: boolean
}>()

const dir = computed(() => props.dir ?? 'right')
const vertical = computed(() => ['up', 'down', 'both-y'].includes(dir.value))
const candidates = computed(() =>
  props.labels?.length ? props.labels : (props.label ? [props.label] : []),
)

const head = computed(() => ({
  start: ['left', 'both', 'up', 'both-y'].includes(dir.value),
  end: ['right', 'both', 'down', 'both-y'].includes(dir.value),
}))

const place = inject(StagePlaceKey, null)?.()
const arriving = useArriving()
</script>

<template>
  <div
    class="tf-stroke-group"
    :data-tf-axis="vertical ? 'y' : undefined"
    :data-tf-flip="flip || undefined"
    :data-tf-hidden="hidden || undefined"
    :data-tf-enter="place !== undefined && arriving || undefined"
    :data-tf-name="name"
    :style="{ '--tf-enter-place': place }"
  >
    <span class="tf-stroke-sizer" aria-hidden="true">
      <span v-for="text in candidates" :key="text">{{ text }}</span>
    </span>

    <span class="tf-stroke-label" :class="{ 'is-off': !label }">{{ label || '&nbsp;' }}</span>

    <!--
      Every coordinate is a percentage of the box or an offset from one, so the mark
      redraws correctly at any length: the line spans the box and each chevron hangs
      off a nested viewport pinned to the end it points at. Nothing here needs to be
      measured, and nothing breaks if the box is resized.
    -->
    <span
      v-if="!vertical"
      class="tf-stroke-line"
      :style="length ? { width: length } : undefined"
    >
      <svg class="tf-stroke">
        <line x1="0" y1="50%" x2="100%" y2="50%" />
        <svg v-if="head.start" x="0" y="50%" overflow="visible">
          <polyline points="18,-18 0,0 18,18" />
        </svg>
        <svg v-if="head.end" x="100%" y="50%" overflow="visible">
          <polyline points="-18,-18 0,0 -18,18" />
        </svg>
      </svg>
    </span>

    <span
      v-else
      class="tf-stroke-line tf-stroke-line--y"
      :style="length ? { height: length } : undefined"
    >
      <svg class="tf-stroke">
        <line x1="50%" y1="0" x2="50%" y2="100%" />
        <svg v-if="head.start" x="50%" y="0" overflow="visible">
          <polyline points="-18,18 0,0 18,18" />
        </svg>
        <svg v-if="head.end" x="50%" y="100%" overflow="visible">
          <polyline points="-18,-18 0,0 18,-18" />
        </svg>
      </svg>
    </span>
  </div>
</template>
