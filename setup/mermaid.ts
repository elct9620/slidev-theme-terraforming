import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    look: 'handDrawn',
    theme: "neutral",
    /**
     * Font Family
     *
     * Excalifont: https://plus.excalidraw.com/excalifont
     * XiaolaiSC: https://github.com/lxgw/kose-font
     */
    fontFamily: "Excalifont,XiaolaiSC",
  }
})
