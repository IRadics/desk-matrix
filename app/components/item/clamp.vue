<script setup lang="ts">
import { Group as VGroup, Rect as VRect, RegularPolygon as VRegularPolygon, Circle as VCircle, Text as VText, type VueKonvaRef, Shape as VShape } from 'vue-konva';
import {Shape} from 'konva/lib/Shape'


const props = defineProps({
    id: {
        type: String,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    },
    draggingDisabled: {
        type: Boolean,
        default: false
    },
    initialPosition: {
        type: Object as PropType<{x: number, y: number}>,
        default: {
            x: 0,
            y: 0
        }
    },
})


const clampWidth = BEAMWIDTH + 10;
const clampX = -(clampWidth - BEAMWIDTH) / 2

const groupRef = useTemplateRef<VueKonvaRef<Group>>('group')
const node = computed(() => {
    return groupRef.value?.getNode()!
})

const _snapPointRef = useTemplateRef<VueKonvaRef<Shape>>(`${props.id}_1`);
const snapPointRefs = computed(() => [_snapPointRef.value].filter((s)=>!!s))

const getSnapPoints = (): SnapPoint[] => {
    return  snapPointRefs.value!.map((ref) => {
        const snapNode = ref.getNode()
        return {
            id: snapNode.getAttr('id')!,
            x: ref.getNode().absolutePosition().x,
            y: ref.getNode().absolutePosition().y,
            type: 'female',
            offsetToParent: {
                x: node.value.getAbsolutePosition().x - snapNode.getAbsolutePosition().x,
                y: node.value.getAbsolutePosition().y - snapNode.getAbsolutePosition().y
            },
            node: snapNode,
            direction: 0,
        }
    })
}

const highLightedConnection: Ref<string | null> = ref(null)

const highlightSnapPoint = (id : string | null) =>{
    highLightedConnection.value = id
}

const isDragging = ref(false)

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
    partType: 'clamp'
} ) 

const strokeConfig = computed(() => {
    return {
        stroke: props.selected ? STROKESELECTEDCOLOR : STROKECOLOR,
        strokeWidth: props.selected ? STROKESELECTEDWIDTH : STROKEWIDTH
    }
})


</script>
<template>
    <v-group ref="group" 
        :config="{
            draggable: !props.draggingDisabled, 
            x: initialPosition.x,
            y: initialPosition.y
        }"  
        @dragstart="isDragging = true; emit('dragging', true)" 
        @dragend="isDragging = false; emit('dragging', false)"
        @dragmove=" emit('dragging', true)"
        @click="emit('clicked')"
        >

            <v-rect :config="({
                x: clampX,
                y: 25,
                width: clampWidth,
                height: 50,
                fill: CLAMP.color,
                stroke: strokeConfig.stroke,
                strokeWidth: strokeConfig.strokeWidth
            } as RectConfig)"
            />

            <v-rect :config="({
                x: clampX,
                y: 50 - 10,
                width: clampWidth,
                height: 10,
                fill: CLAMP.colorDark,
                stroke: STROKECOLOR,
                strokeWidth: STROKEWIDTH
            } as RectConfig)"
            />

            <v-rect :config="({
                x: clampX,
                y: 75 - 10,
                width:  clampWidth,
                height: 10,
                fill: CLAMP.colorDark,
                stroke: STROKECOLOR,
                strokeWidth: STROKEWIDTH
            } as RectConfig)"
            />

            <v-rect :config="({
                x: 0,
                y: 0,
                width: BEAMWIDTH,
                height: 25,
                fill: CLAMP.color,
                stroke: strokeConfig.stroke,
                strokeWidth: strokeConfig.strokeWidth
            } as RectConfig)"
            />
            <v-circle 
            :ref="`${id}_1`" 
            :id=" `${id}_1`",
            :config="{
                id: `${id}_1`, 
                x: BEAMWIDTH / 2,
                y: 0,
                radius: 10,
                opacity: 0.5,
                connectorType: 'female',
                fill: highLightedConnection === `${id}_1` ? CON_HL_COLOR : undefined,
                isSnap : false,
            }"
        />


        </v-group>
</template>