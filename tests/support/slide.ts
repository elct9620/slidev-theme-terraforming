/**
 * The slide a component under test is mounted on, as state a test can drive.
 *
 * What the composables owe Slidev is a registration — a length declared through the
 * clicks context — and what they read back is the current click, whether this slide is
 * the one on screen, and whether the deck is being printed. Those four are all there is
 * to stand in for.
 */
import { ref } from 'vue'

export const clicks = ref(0)
export const isActive = ref(true)
export const isPrintMode = ref(false)

/** Every length a component has declared, keyed the way the composables key it. */
export const registrations = new Map<unknown, { max: number, delta: number }>()

/** A fresh slide, on screen and unspoken, before each test. */
export function resetSlide() {
  clicks.value = 0
  isActive.value = true
  isPrintMode.value = false
  registrations.clear()
}

/** The lengths declared, without the keys, which carry a counter no test can predict. */
export function declaredLengths() {
  return [...registrations.values()]
}
