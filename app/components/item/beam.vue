<script setup lang="ts">
import { Group as VGroup, Rect as VRect, RegularPolygon as VRegularPolygon, Circle as VCircle, Text as VText, type VueKonvaRef, } from 'vue-konva';
import {Shape,} from 'konva/lib/Shape'

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    lenght: {
        type: Number,
        required: true
    },
    initialPosition: {
        type: Object as PropType<{x: number, y: number}>,
        default: {
            x: 0,
            y: 0
        }
    },
    initialRotation: {
        type: Number as PropType<0 | 90 | 180 | 270>,
        default: 0
    },
    type: {
        type: String as PropType<'male-female' | 'female-male' | 'male-male' | 'female-female'>,
        required: true
    },
    snapType: {
        type: String as PropType<'regular' | 'quad'>,
        required: true
    },
    draggingDisabled: {
        type: Boolean,
        default: false
    },
    selected: {
        type: Boolean,
        default: false
    }
})


const beamLength = computed(() => props.lenght * 25)
const groupRef = useTemplateRef<VueKonvaRef<Group>>('group')
const node = computed(() => {
    return groupRef.value?.getNode()!
})

const textRef = useTemplateRef<VueKonvaRef<TextKonva>>('text')


const _snapPointRefs = ref<Ref<VueKonvaRef<Shape>>[]>([])
for (let i = 1; i <= 8; i++) {
    // @ts-expect-error-next-line
    _snapPointRefs.value.push(useTemplateRef(`${props.id}_${i}`))
}
const snapPointRefs = computed(() => _snapPointRefs.value.filter((ref) => ref.value).map((ref) => ref.value))

const getSnapPoints = (): SnapPoint[] => {
    return  snapPointRefs.value.map((ref) => {
        const snapNode = ref.getNode()
        return {
            id: snapNode.getAttr('id')!,
            direction: snapNode.getAttr('direction') as SnapPoint['direction'],
            x: ref.getNode().absolutePosition().x,
            y: ref.getNode().absolutePosition().y,
            type: snapNode.getAttr('connectorType') as SnapPoint['type'],
            offsetToParent: {
                x: node.value.getAbsolutePosition().x - snapNode.getAbsolutePosition().x,
                y: node.value.getAbsolutePosition().y - snapNode.getAbsolutePosition().y
            },
            node: snapNode
        }
    })
}

const isDragging = ref(false)

const highLightedConnection: Ref<string | null> = ref(null)

const highlightSnapPoint = (id : string | null) =>{
    highLightedConnection.value = id
}

const rotation = ref<number>(props.initialRotation)
const rotate = () => {
    rotation.value = (rotation.value + 90) % 360
}

const getTextWidth = (): number => {
    return textRef.value?.getNode().textWidth ?? 0
}


const strokeConfig = computed(() => {
    return {
        stroke: props.selected ? STROKESELECTEDCOLOR : STROKECOLOR,
        strokeWidth: props.selected ? STROKESELECTEDWIDTH : STROKEWIDTH
    }
})

const rectConfig: RectConfig = computed(() => {
    return {
        x: 0,
        y: 0,
        width: BEAMWIDTH,
        height: beamLength.value,
        fill: BEAM.color,
        stroke: strokeConfig.value.stroke,
        strokeWidth: strokeConfig.value.strokeWidth,
    }
})

const {
    setConnectorLayer,
    unSetConnectorLayer,
    updateConnectorPositions
} = useConnectorLayer(node, rotation)

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
    rotation
})


</script>
<template>
    <v-group ref="group" 
        :config="({
            draggable: !props.draggingDisabled, 
            rotation: rotation,
            x: initialPosition.x,
            y: initialPosition.y,
        } as GroupConfig)"  
        @dragstart="isDragging = true; emit('dragging', true)" 
        @dragend="isDragging = false; emit('dragging', false)"
        @dragmove="emit('dragging', true)"
        @click="emit('clicked')"
        >
        <v-rect :config="rectConfig"/>
        <template v-if="snapType === 'regular'">
            <v-regular-polygon 
                :ref="`${id}_1`"
                :id=" `${id}_1`",
                :config="{
                    id: `${id}_1`,
                    x: BEAMWIDTH / 2,
                    y: 25,
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
            />
            <v-regular-polygon 
                :ref="`${id}_2`"
                :id=" `${id}_2`",
                :config="{
                    id: `${id}_2`, 
                    x: 14.5,
                    y: beamLength - 25, 
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
            />
        </template>
        <template v-else>
            <v-rect
                :config="{
                    height: 50,
                    width: BEAMWIDTH - 6,
                    x: -BEAMWIDTH + 6,
                    y: (beamLength / 2) - 25,
                    fill: BEAM.color,
                    stroke: strokeConfig.stroke,
                    strokeWidth: strokeConfig.strokeWidth,
                }"
            />
            <v-regular-polygon 
                :ref="`${id}_3`"
                :id=" `${id}_3`",
                :config="{
                    id: `${id}_3`,
                    x: (BEAMWIDTH / 2),
                    y: (beamLength / 2) - (25 / 2),
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
            />
            <v-regular-polygon 
                :ref="`${id}_4`"
                :id=" `${id}_4`",
                :config="{
                    id: `${id}_4`,
                    x: (BEAMWIDTH / 2),
                    y: (beamLength / 2) + (25 / 2),
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
            />
            <v-regular-polygon 
                :ref="`${id}_5`"
                :id=" `${id}_5`",
                :config="{
                    id: `${id}_5`,
                    x: (BEAMWIDTH / 2) - 25,
                    y: (beamLength / 2) - (25 / 2),
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
            />
            <v-regular-polygon 
                :ref="`${id}_6`"
                :id=" `${id}_6`",
                :config="{
                    id: `${id}_6`,
                    x: (BEAMWIDTH / 2) - 25,
                    y: (beamLength / 2) + (25 / 2),
                    sides: 8,
                    radius: 11,
                    rotation: 45 / 2,
                    fill: SNAPCOLOR,
                    connectorType: 'snap'
                }"
        />
        </template>
        <v-group 
            v-if="type === 'female-male' || type === 'male-male'"
            :config="{name:'connector'}">
            <v-rect 
                :config="{
                x: 2,
                y: -25,
                width: BEAMWIDTH - 4,
                height: 25,
                fill: BEAM.color,
                stroke: strokeConfig.stroke,
                strokeWidth: strokeConfig.strokeWidth,
            }" 
            />
            <v-circle :config="{
                x: 6, 
                y: -12.5,
                radius: 2, 
                fill: 'white'
            }"
            />
        </v-group>
        <v-circle 
            :ref="`${id}_7`" 
            :id=" `${id}_7`",
            :config="{
                id: `${id}_7`, 
                x: BEAMWIDTH / 2,
                y: 0,
                radius: 10,
                opacity: 0.5,
                connectorType: ['female-male','male-male',].includes(type) ? 'male' : 'female',
                fill: highLightedConnection === `${id}_7` ? CON_HL_COLOR : undefined,
                direction: rotation,
                isSnap : false,
            }"
        />
        <v-group 
            v-if="type === 'male-female' || type === 'male-male'"
            :config="{name:'connector'}">
            <v-rect :config="{
                x: 2,
                y: beamLength,
                width: BEAMWIDTH - 4,
                height: 25,
                fill: BEAM.color,
                stroke: strokeConfig.stroke,
                strokeWidth: strokeConfig.strokeWidth,
            }" 
            />
            <v-circle :config="{
                x: 6, 
                y: beamLength +12.5,
                radius: 2, 
                fill: 'white'
            }"
            />
        </v-group>
        <v-circle 
            :ref="`${id}_8`" 
            :id=" `${id}_8`",
            :config="{
                id: `${id}_8`, 
                x: BEAMWIDTH / 2,
                y: beamLength,
                radius: 10,
                opacity: 0.5,
                connectorType: ['male-female','male-male',].includes(type) ? 'male' : 'female',
                fill: highLightedConnection === `${id}_8` ? CON_HL_COLOR : undefined,
                direction: (180 + rotation) % 360,
                isSnap : false,
            }"/>
        <v-text 
            ref="text"
            :config="{
                fontSize: 16,
                text: lenght,
                x: BEAMWIDTH / 2,
                y: beamLength / 2,
                offsetX: getTextWidth() / 2,
                offsetY: 16 / 2,
                fill: 'black',
                rotation: -rotation,
                align: 'center',
                fontStyle: 'bold'
            }"
        />
    </v-group>
</template>