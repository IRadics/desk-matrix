<script lang="ts" setup>
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
    width : {
        type: Number,
        required: true
    },
    height : {
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
})

const groupRef = useTemplateRef<VueKonvaRef<Group>>('group')
const node = computed(() => {
    return groupRef.value?.getNode()!
})

const rectRef = useTemplateRef<VueKonvaRef<Rect>>('rect')
const rectNode = computed(() =>{
    return rectRef.value?.getNode()!
})


const _snapPointRefs = useTemplateRef<VueKonvaRef<Shape>[]>('snapPoint')
const snapPointRefs = computed(() => _snapPointRefs.value?.filter((ref) => ref))


const getSnapPoints = (): SnapPoint[] => {
    return  snapPointRefs.value!.map((ref) => {
        const snapNode = ref.getNode()
        return {
            id: snapNode.getAttr('id')!,
            x: ref.getNode().absolutePosition().x,
            y: ref.getNode().absolutePosition().y,
            type: 'snapHole',
            offsetToParent: {
                x: node.value.getAbsolutePosition().x - snapNode.getAbsolutePosition().x,
                y: node.value.getAbsolutePosition().y - snapNode.getAbsolutePosition().y
            },
            node: snapNode
        }
    })
}

const isDragging = ref(false)


const highlightedSnapPoint = ref<string | null>(null)
/* const resetHighlight = () =>{
    if (highlightedSnapPoint.value) {
        const snap = snapPointRefs.value?.find((s) => s.getNode().getAttr('id') === highlightedSnapPoint.value)
        snap?.getNode().globalCompositeOperation('destination-out')
        highlightedSnapPoint.value = null
    }
} */
const highlightSnapPoint = (id: string | null) => {
/* 
    if(highlightedSnapPoint.value === id) {
        return;
    }

    resetHighlight()

    if (id) {
        const snap = snapPointRefs.value?.find((s) => s.getNode().getAttr('id') === id)
        if (snap) {
            highlightedSnapPoint.value = id
            snap.getNode().globalCompositeOperation('source-over')
        }
    }

    node.value.cache() */

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
    partType: 'board'
} ) 

onMounted(()=>{
    node.value.cache()  
})

watch(()=>props.selected,(value)=>{
    if(value) {
        rectNode.value.stroke(STROKESELECTEDCOLOR)
        rectNode.value.strokeWidth(STROKESELECTEDWIDTH)
    } else {
        rectNode.value.stroke(STROKECOLOR)
        rectNode.value.strokeWidth(STROKEWIDTH)
    }

    node.value.cache()
})

</script>
<template>
    <v-group 
        ref="group"
        :config="({
            draggable: !props.draggingDisabled, 
            x: initialPosition.x,
            y: initialPosition.y,
        }) as GroupConfig"
        @dragstart="isDragging = true; emit('dragging', true)" 
        @dragend="isDragging = false; emit('dragging', false)"
        @dragmove=" emit('dragging', true)"
        @click="emit('clicked')"
    >
        <v-rect 
            ref="rect"
            :config="({
            x: 0,
            y: 0,
            width: width * 25,
            height: height * 25,
            fill: BOARD.color,
            stroke: STROKECOLOR,
            strokeWidth: STROKEWIDTH,
            globalCompositeOperation: 'source-over',
        } as RectConfig)" />
        <template v-for="y in height">
            <template v-for="x in width">
                <v-regular-polygon 
                    ref="snapPoint"
                    :id="`${id}_${x}_${y}`",
                    :config="({
                        id: `${id}_${x}_${y}`,
                        x: -12.5 + (25 * x),
                        y: -12.5 + (25 * y),
                        sides: 8,
                        radius: 11,
                        rotation: 45 / 2,
                        fill: CON_HL_COLOR,
                        globalCompositeOperation: 'destination-out',
                    } as RegularPolygonConfig)" 
                />
            </template>
        </template>
    </v-group>
</template>