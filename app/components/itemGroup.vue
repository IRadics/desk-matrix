<script lang="ts" setup>
import { Stage as VStage, Layer as VLayer, Star as VStar, Group as VGroup, Rect as VRect, type VueKonvaRef } from 'vue-konva';

const recoverPosition = (part: Group) => {
    part.setAbsolutePosition({
        x: part.getAbsolutePosition().x + (groupNode.value?.getAbsolutePosition().x ?? 0),
        y: part.getAbsolutePosition().y + (groupNode.value?.getAbsolutePosition().y ?? 0)
    })
}

const setNewPartPosition = (part: Group) => {
    part.setAbsolutePosition({
        x: part.getAbsolutePosition().x - (groupNode.value?.getAbsolutePosition().x ?? 0),
        y: part.getAbsolutePosition().y - (groupNode.value?.getAbsolutePosition().y ?? 0)
    })
}

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    groupData: {
        type: Array as PropType<GroupData>,
        required: true
    },
    mainGroupNode: {
        type: Object as PropType<Group>,
        required: true
    },
    dragDisabled: {
        type: Boolean,
        default: false
    }
})

const groupData = toRef(props,'groupData')

const groupRef = useTemplateRef<VueKonvaRef<Group>>('group')
const groupNode = computed(() => groupRef.value?.getNode()!)

const partNodes = computed(()=> groupData.value.map((p)=>p.node))

onMounted(() => {
    groupNode.value.add(...partNodes.value)
    moveBoardsToTop()
})

const moveBoardsToTop = async () =>{
    const boards = groupData.value.filter((d)=>d.part.partType === 'board')
    await nextTick()
    for (const board of boards) {
        board.node.moveToTop()
    }
}

watch(partNodes, (newParts, oldParts) => {
    // Remove old parts that are no longer in the new parts array
    oldParts.forEach(oldPart => {
        if(!newParts.includes(oldPart)) {
            recoverPosition(oldPart)
            props.mainGroupNode.add(oldPart)
        }
    })
    // Add new parts that are not already in the group
    newParts.forEach(newPart => {
        if(!oldParts.includes(newPart)) {
            setNewPartPosition(newPart)
            groupNode.value.add(newPart)
        }
    })

     moveBoardsToTop()
})

onBeforeUnmount(() => {
    partNodes.value.forEach(part => {
        recoverPosition(part)
    })
    props.mainGroupNode.add(...partNodes.value)
})

const isDragging = ref(false)
const emit = defineEmits<{
    dragging: [isDragging: boolean]
}>()

</script>

<template>
    <v-group 
        ref="group" 
        :config="{draggable: !props.dragDisabled}"         
        @dragstart="isDragging = true; emit('dragging', true)" 
        @dragend="isDragging = false; emit('dragging', false)"
        @dragmove=" emit('dragging', true)"
    />
</template>