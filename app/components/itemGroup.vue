<script lang="ts" setup>
import { Stage as VStage, Layer as VLayer, Star as VStar, Group as VGroup, Rect as VRect, type VueKonvaRef } from 'vue-konva';

const recoverPosition = (part: Group) => {
    const stagePos = part.getStage()?.getAbsolutePosition() ?? { x: 0, y: 0 }
    part.setAbsolutePosition({
        x: ((part.getAbsolutePosition().x + (groupNode.value?.getAbsolutePosition().x ?? 0))) - stagePos.x,
        y: ((part.getAbsolutePosition().y + (groupNode.value?.getAbsolutePosition().y ?? 0))) - stagePos.y
    })
}

const setNewPartPosition = (part: Group) => {
    const stagePos = part.getStage()?.getAbsolutePosition() ?? { x: 0, y: 0 }
    part.setAbsolutePosition({
        x: part.getAbsolutePosition().x - (groupNode.value?.getAbsolutePosition().x ?? 0) + stagePos.x,
        y: part.getAbsolutePosition().y - (groupNode.value?.getAbsolutePosition().y ?? 0) + stagePos.y
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
    groupData.value.forEach((d)=>{
        d.componentRef.setConnectorLayer? d.componentRef.setConnectorLayer() : null
    })
    moveBoardsToTop()
})

const moveBoardsToTop = async () =>{
    const boards = groupData.value.filter((d)=>d.part.partType === 'board')
    await nextTick()
    for (const board of boards) {
        board.node.moveToTop()
    }
}

watch(groupData, (newValue, oldValue) => {
    const newNodes = newValue.map((v)=>v.node)
    const oldNodes = oldValue.map((v)=>v.node)

    // Remove old parts that are no longer in the new parts array
    oldValue.forEach(oldPart => {
        if(!newNodes.map(n=>n._id).includes(oldPart.node._id)) {
            recoverPosition(oldPart.node)
            props.mainGroupNode.add(oldPart.node)
            if(oldPart.componentRef.unSetConnectorLayer) {
                oldPart.componentRef.unSetConnectorLayer()
            }
        }
    })

    // Add new parts that are not already in the group
    newValue.forEach(newPart => {

        if(!oldNodes.map(node=>node._id).includes(newPart.node._id)) {
            setNewPartPosition(newPart.node)
            groupNode.value.add(newPart.node)
            if (newPart.componentRef.setConnectorLayer) {
                newPart.componentRef.setConnectorLayer()
            }

        }
    })

     moveBoardsToTop()
})

onBeforeUnmount(() => {
    partNodes.value.forEach(part => {
        recoverPosition(part)
    })
    props.mainGroupNode.add(...partNodes.value)
    groupData.value.forEach((d) => {
        d.componentRef.unSetConnectorLayer ? d.componentRef.unSetConnectorLayer() : null
    })
})

const onDrag = () => {
    groupData.value.filter((d) => Boolean(d.componentRef.updateConnectorPositions)).forEach((d) => {
        d.componentRef.updateConnectorPositions!()
    })
}

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
        @dragmove="onDrag(); emit('dragging', true)"
    />
</template>