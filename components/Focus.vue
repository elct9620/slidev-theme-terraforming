<!--
  The selection box — a frame drawn around whatever is being spoken about right now.

  It is positioned absolutely and takes no space, so moving the focus never disturbs
  the arrangement underneath it. That is also what lets it animate the way a selection
  box does in Figma: the same element stays on the page and its position and size
  transition, rather than one frame fading out while another fades in.

  `of` names the pieces to frame, by their `name`. Several names give the box that
  contains them all, so neighbours read as a range; an empty value lifts the focus
  off the page entirely. Nothing here refers to coordinates — the geometry is measured
  from the pieces themselves, so inserting a block never renumbers anything.

  `steps` says what to frame at each click and takes the place of `of`. The slide
  learns its length from it, so the walk through a diagram is stated once instead of
  being split between a frontmatter count and a chain of `$clicks` comparisons:

    <Focus :steps="[null, 'object', 'proxy', ['proxy', 'object']]" />

  A `null` entry frames nothing, which is how the box waits offstage until the click
  it belongs to.

  Leave both out to place the box by hand instead, which is what `v-drag` needs in
  order to frame something the stage does not own:

    <Focus v-drag="[420, 180, 660, 220]" />
-->
<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { StageKey } from '../composables/stage'
import { useSteps } from '../composables/steps'

const props = defineProps<{
  of?: string | string[]
  steps?: (string | string[] | null)[]
  color?: 'jinZamOmi' | 'gunJyo' | 'tamago' | 'gray'
}>()

const step = useSteps(() => props.steps)

const stage = inject(StageKey, null)

// The last geometry measured, kept even while the box frames nothing, so that a
// focus which comes back resumes from where it was rather than flying in from the
// corner the element would otherwise collapse to.
const box = ref<{ left: number, top: number, width: number, height: number }>()
const framing = ref(false)

const names = computed(() => {
  const value = props.steps ? step.value : props.of
  if (!value)
    return []
  return (Array.isArray(value) ? value : value.split(',')).map(n => n.trim()).filter(Boolean)
})

// Placing the box by hand is the one case where framing nothing is the point, so
// the fade applies only once a deck has said what to frame.
const off = computed(() => (props.of !== undefined || props.steps !== undefined) && !framing.value)

let observer: ResizeObserver | undefined

function measure() {
  const root = stage?.value
  const targets = root && names.value.length
    ? names.value
        .map(name => root.querySelector(`[data-tf-name="${CSS.escape(name)}"]`))
        .filter((el): el is HTMLElement => el instanceof HTMLElement)
    : []

  framing.value = targets.length > 0
  if (!framing.value)
    return

  // offsetLeft and friends report layout values from before any transform, measured
  // against the offsetParent — which is the stage, since it is the positioned
  // ancestor. Client rects would be measured after the stage's own scale and then
  // scaled a second time by being placed inside it.
  const left = Math.min(...targets.map(el => el.offsetLeft))
  const top = Math.min(...targets.map(el => el.offsetTop))
  const right = Math.max(...targets.map(el => el.offsetLeft + el.offsetWidth))
  const bottom = Math.max(...targets.map(el => el.offsetTop + el.offsetHeight))

  box.value = { left, top, width: right - left, height: bottom - top }
}

onMounted(() => {
  if (!stage?.value)
    return

  observer = new ResizeObserver(measure)
  observer.observe(stage.value)
  document.fonts?.ready.then(measure)
  measure()
})

onBeforeUnmount(() => observer?.disconnect())

watch(names, measure)
</script>

<template>
  <div
    class="tf-focus"
    :data-tf-color="color ?? 'jinZamOmi'"
    :data-tf-off="off || undefined"
    :style="box ? {
      left: `${box.left}px`,
      top: `${box.top}px`,
      width: `${box.width}px`,
      height: `${box.height}px`,
    } : undefined"
  />
</template>
