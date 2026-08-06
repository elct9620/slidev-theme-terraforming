<!--
  A page whose content is the diagram itself: no heading, centred on both axes so the
  figure sits in the optical middle of the canvas rather than at the top of a column.

  The container holds the width the page gives it. `min-w-0` is what stops a figure
  wider than the page from pushing the container out to match: a container sized by its
  contents leaves every figure measuring itself against its own width, so nothing can
  centre and nothing can tell that it overflowed. A figure that does is then the
  figure's own problem to solve, which is what a Stage's `fit` is for.
-->
<template>
  <div class="slidev-layout diagram">
    <div class="my-auto min-w-0">
      <slot />
    </div>
  </div>
</template>
