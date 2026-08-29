<script setup lang="ts">
import type Konva from 'konva'
import { Layer as VLayer, Shape as VShape, type VueKonvaRef } from 'vue-konva'

defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
})

const GRID_SIZE = 25
const GRID_EXTENT = 5000

function drawGrid(context: Konva.Context, shape: Konva.Shape) {
  context.beginPath()

  // Vertical lines
  for (let x = -GRID_EXTENT; x <= GRID_EXTENT; x += GRID_SIZE) {
    context.moveTo(x, -GRID_EXTENT)
    context.lineTo(x, GRID_EXTENT)
  }

  // Horizontal lines
  for (let y = -GRID_EXTENT; y <= GRID_EXTENT; y += GRID_SIZE) {
    context.moveTo(-GRID_EXTENT, y)
    context.lineTo(GRID_EXTENT, y)
  }

  context.strokeShape(shape)
}

const layer = useTemplateRef<VueKonvaRef<Layer>>('layer')

// make sure the grid player is the first
watch(
  layer,
  () => {
    layer.value?.getNode().setZIndex(1)
  },
  { once: true },
)
</script>

<template>
  <v-layer
    ref="layer"
    :listening="false"
    :config="
      {
        visible: visible,
      } as LayerConfig
    "
  >
    <v-shape
      :config="{
        sceneFunc: drawGrid,
        listening: false,
        stroke: 'rgba(0,0,0,0.4)',
        strokeWidth: 1,
      }"
    />
  </v-layer>
</template>
