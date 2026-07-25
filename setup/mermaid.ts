import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    look: 'handDrawn',
    theme: 'neutral',
    /**
     * Excalifont: https://plus.excalidraw.com/excalifont
     * XiaolaiSC: https://github.com/lxgw/kose-font
     */
    fontFamily: 'Excalifont,XiaolaiSC',
    /**
     * Mermaid derives node sizes from its own text metrics, so a diagram is only as
     * large as its base type. Putting that base on the body step of the type scale is
     * what makes a diagram occupy a sensible share of the 1920 canvas — scaling the
     * finished SVG instead would blur the strokes and break the shared 5px weight.
     */
    fontSize: 36,
    themeVariables: {
      fontSize: '36px',
    },
  }
})
