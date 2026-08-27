<script lang="ts" setup>
import {
  Group as VGroup,
  Rect as VRect,
  RegularPolygon as VRegularPolygon,
  Circle as VCircle,
  type VueKonvaRef,
  Shape as VShape,
} from 'vue-konva'
import type { Shape } from 'konva/lib/Shape'
import type Konva from 'konva'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  initialPosition: {
    type: Object as PropType<{ x: number; y: number }>,
    default: () => ({
      x: 0,
      y: 0,
    }),
  },
  initialRotation: {
    type: Number as PropType<0 | 90 | 180 | 270>,
    default: 0,
  },
  type: {
    type: String as PropType<'2-way-corner' | '3-way-corner' | '4-way-corner'>,
    required: true,
  },
  snapType: {
    type: String as PropType<'regular' | 'none'>,
    required: false,
    default: 'none',
  },
  draggingDisabled: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const { beamSettings } = useItemSettings()
const _snapPointRefs = ref<Ref<VueKonvaRef<Shape>>[]>([])
for (let i = 1; i <= 8; i++) {
  // @ts-expect-error-next-line
  _snapPointRefs.value.push(useTemplateRef(`${props.id}_${i}`))
}
const snapPointRefs = computed(() =>
  _snapPointRefs.value.filter(ref => ref.value).map(ref => ref.value),
)
const groupRef = useTemplateRef<VueKonvaRef<Group>>('group')
const node = computed(() => {
  return groupRef.value!.getNode()
})

const getSnapPoints = (): SnapPoint[] => {
  return (snapPointRefs.value ?? []).map(ref => {
    const snapNode = ref.getNode()
    return {
      id: snapNode.getAttr('id')!,
      direction: snapNode.getAttr('direction') as SnapPoint['direction'],
      x: ref.getNode().absolutePosition().x,
      y: ref.getNode().absolutePosition().y,
      type: snapNode.getAttr('connectorType') as SnapPoint['type'],
      offsetToParent: {
        x:
          node.value.getAbsolutePosition().x - snapNode.getAbsolutePosition().x,
        y:
          node.value.getAbsolutePosition().y - snapNode.getAbsolutePosition().y,
      },
      node: snapNode,
    }
  })
}

const isDragging = ref(false)

const rotation = ref<Rotation>(props.initialRotation ?? 0)
const rotate = () => {
  rotation.value = ((rotation.value + 90) % 360) as Rotation
}

const { setConnectorLayer, unSetConnectorLayer, updateConnectorPositions } =
  useConnectorLayer(node, rotation)

const highLightedConnection = ref<string | null>(null)

const highlightSnapPoint = (id: string | null) => {
  highLightedConnection.value = id
}

const centerSize = BEAMWIDTH
const sideRectWidth = 10.5

const strokeConfig = computed(() => {
  return {
    stroke: props.selected ? STROKESELECTEDCOLOR : STROKECOLOR,
    strokeWidth: props.selected ? STROKESELECTEDWIDTH : STROKEWIDTH,
  }
})

const enabledConnectors = computed(() => {
  return {
    left: props.type === '4-way-corner',
    bottom: props.type === '4-way-corner' || props.type === '3-way-corner',
    top: true,
    right: true,
  }
})

const sceneFunc = (ctx: Konva.Context, shape: Konva.Shape) => {
  if (enabledConnectors.value.left) {
    // Left rect
    ctx.beginPath()
    ctx.rect(
      -BEAMWIDTH / 2 - sideRectWidth,
      -BEAMWIDTH / 2,
      sideRectWidth,
      BEAMWIDTH,
    )
    ctx.fillStrokeShape(shape)
  }

  if (enabledConnectors.value.right) {
    // Right rect
    ctx.beginPath()
    ctx.rect(BEAMWIDTH / 2, -BEAMWIDTH / 2, sideRectWidth, BEAMWIDTH)
    ctx.fillStrokeShape(shape)
  }

  if (enabledConnectors.value.top) {
    // Top rect
    ctx.beginPath()
    ctx.rect(
      -BEAMWIDTH / 2,
      -BEAMWIDTH / 2 - sideRectWidth,
      BEAMWIDTH,
      sideRectWidth,
    )
    ctx.fillStrokeShape(shape)
  }

  if (enabledConnectors.value.bottom) {
    // Bottom rect
    ctx.beginPath()
    ctx.rect(-BEAMWIDTH / 2, BEAMWIDTH / 2, BEAMWIDTH, sideRectWidth)
    ctx.fillStrokeShape(shape)
  }

  // Center block
  ctx.beginPath()
  ctx.rect(-centerSize / 2, -centerSize / 2, centerSize, centerSize)
  ctx.fillStrokeShape(shape)
}

const emit = defineEmits<{
  dragging: [isDragging: boolean]
  clicked: []
}>()

defineExpose<ExposePartInstance>({
  id: props.id,
  getSnapPoints,
  highlightSnapPoint,
  isDragging,
  node,
  rotate,
  partType: 'beam',
  setConnectorLayer,
  unSetConnectorLayer,
  updateConnectorPositions,
  rotation,
})
</script>

<template>
  <v-group
    ref="group"
    :config="
      {
        draggable: !props.draggingDisabled,
        x: initialPosition.x,
        y: initialPosition.y,
        rotation: rotation,
        ...beamSettings,
      } as GroupConfig
    "
    @dragstart="
      () => {
        isDragging = true
        emit('dragging', true)
      }
    "
    @dragend="
      () => {
        isDragging = false
        emit('dragging', false)
      }
    "
    @dragmove="emit('dragging', true)"
    @click="emit('clicked')"
  >
    <v-shape
      :config="
        {
          fill: BEAM.color,
          stroke: strokeConfig.stroke,
          strokeWidth: strokeConfig.strokeWidth,
          sceneFunc: sceneFunc,
        } as ShapeConfig
      "
    >
    </v-shape>

    <v-group v-if="enabledConnectors.left" :config="{ name: 'connector' }">
      <v-rect
        :config="{
          x: BEAMWIDTH / 2 - 75 + sideRectWidth,
          y: -BEAMWIDTH / 2 + 2,
          width: 25,
          height: BEAMWIDTH - 4,
          fill: BEAM.color,
          stroke: strokeConfig.stroke,
          strokeWidth: strokeConfig.strokeWidth,
        }"
      />
      <v-circle
        :config="{
          x: BEAMWIDTH / 2 - 75 + sideRectWidth + 12.5,
          y: -BEAMWIDTH / 2 + 2 + 6,
          radius: 2,
          fill: 'white',
        }"
      />
    </v-group>
    <v-group v-if="enabledConnectors.right" :config="{ name: 'connector' }">
      <v-rect
        :config="{
          x: BEAMWIDTH / 2 + sideRectWidth,
          y: -BEAMWIDTH / 2 + 2,
          width: 25,
          height: BEAMWIDTH - 4,
          fill: BEAM.color,
          stroke: strokeConfig.stroke,
          strokeWidth: strokeConfig.strokeWidth,
        }"
      />
      <v-circle
        :config="{
          x: BEAMWIDTH / 2 + sideRectWidth + 12.5,
          y: -BEAMWIDTH / 2 + 2 + 6,
          radius: 2,
          fill: 'white',
        }"
      />
    </v-group>

    <v-group v-if="enabledConnectors.top" :config="{ name: 'connector' }">
      <v-rect
        :config="{
          x: -BEAMWIDTH / 2 + 2,
          y: -BEAMWIDTH / 2 - sideRectWidth - 25,
          width: BEAMWIDTH - 4,
          height: 25,
          fill: BEAM.color,
          stroke: strokeConfig.stroke,
          strokeWidth: strokeConfig.strokeWidth,
        }"
      />
      <v-circle
        :config="{
          x: -BEAMWIDTH / 2 + 2 + 6,
          y: -BEAMWIDTH / 2 - sideRectWidth - 12.5,
          radius: 2,
          fill: 'white',
        }"
      />
    </v-group>
    <v-group v-if="enabledConnectors.bottom" :config="{ name: 'connector' }">
      <v-rect
        :config="{
          x: -BEAMWIDTH / 2 + 2,
          y: BEAMWIDTH / 2 + sideRectWidth,
          width: BEAMWIDTH - 4,
          height: 25,
          fill: BEAM.color,
          stroke: strokeConfig.stroke,
          strokeWidth: strokeConfig.strokeWidth,
        }"
      />
      <v-circle
        :config="{
          x: -BEAMWIDTH / 2 + 2 + 6,
          y: BEAMWIDTH / 2 + sideRectWidth + 12.5,
          radius: 2,
          fill: 'white',
        }"
      />
    </v-group>

    <v-regular-polygon
      v-if="snapType === 'regular'"
      :id="`${id}_1`"
      :ref="`${id}_1`"
      ,
      :config="{
        id: `${id}_1`,
        x: 0,
        y: 0,
        sides: 8,
        radius: 11,
        rotation: 45 / 2,
        fill: SNAPCOLOR,
        connectorType: 'snap',
      }"
    />
    <v-circle
      v-if="enabledConnectors.right"
      :id="`${id}_2`"
      :ref="`${id}_2`"
      :config="{
        id: `${id}_2`,
        x: BEAMWIDTH / 2 + sideRectWidth,
        y: 0,
        radius: 10,
        opacity: 0.5,
        connectorType: 'male',
        fill: highLightedConnection === `${id}_2` ? CON_HL_COLOR : undefined,
        direction: (90 + rotation) % 360,
        isSnap: false,
      }"
    />
    <v-circle
      v-if="enabledConnectors.left"
      :id="`${id}_3`"
      :ref="`${id}_3`"
      :config="{
        id: `${id}_3`,
        x: -BEAMWIDTH / 2 - sideRectWidth,
        y: 0,
        radius: 10,
        opacity: 0.5,
        connectorType: 'male',
        fill: highLightedConnection === `${id}_3` ? CON_HL_COLOR : undefined,
        direction: (270 + rotation) % 360,
        isSnap: false,
      }"
    />
    <v-circle
      v-if="enabledConnectors.top"
      :id="`${id}_4`"
      :ref="`${id}_4`"
      :config="{
        id: `${id}_4`,
        y: -BEAMWIDTH / 2 - sideRectWidth,
        x: 0,
        radius: 10,
        opacity: 0.5,
        connectorType: 'male',
        fill: highLightedConnection === `${id}_4` ? CON_HL_COLOR : undefined,
        direction: (0 + rotation) % 360,
        isSnap: false,
      }"
    />
    <v-circle
      v-if="enabledConnectors.bottom"
      :id="`${id}_5`"
      :ref="`${id}_5`"
      :config="{
        id: `${id}_5`,
        y: BEAMWIDTH / 2 + sideRectWidth,
        x: 0,
        radius: 10,
        opacity: 0.5,
        connectorType: 'male',
        fill: highLightedConnection === `${id}_5` ? CON_HL_COLOR : undefined,
        direction: (180 + rotation) % 360,
        isSnap: false,
      }"
    />
  </v-group>
</template>
