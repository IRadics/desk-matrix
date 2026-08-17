+
<script lang="ts" setup>

const { width, height} = useWindowSize()
const canvasConfig  = computed<StageConfig>(()=> ({
    draggable: true,
    width: width.value ,
    height: height.value - 70
}))



import { Stage as VStage, Layer as VLayer, Star as VStar, Group as VGroup, Rect as VRect, type VueKonvaRef } from 'vue-konva';
import {type KonvaPointerEvent, } from 'konva/lib/PointerEvents'
import type { Stage } from 'konva/lib/Stage';

const snapDistance = 40;

const parts = ref<Part[]>([])

const groups = ref<Record<string, GroupData>>({});

const canConnectByDirection = (d1: SnapPoint['direction'], d2: SnapPoint['direction'], t1: SnapPoint['type'], t2: SnapPoint['type']) => {
  if(t1 === 'snap' && t2 === 'snapHole' || t1 === 'snapHole' && t2 === 'snap') {
    return true
  }
  if(d1 == null || d2 == null) {
    return false
  }
if(((d1 + 180) % 360) === d2) {
    return true   
}
  return false
}

const canConnectByType = (t1: SnapPoint['type'], t2: SnapPoint['type']) => {
  if((t1 === 'male' && t2 === 'female') || (t1 === 'female' && t2 === 'male')) {
    return true
  }
  if(t1 === 'snap' && t2 === 'snapHole' || t1 === 'snapHole' && t2 === 'snap') {
    return true
  }
  return false
}
const partRefs = useTemplateRef<PartInstance[]>('partRef')

const activeBaseSnapPoint = ref<{partId: string, snapPoint: SnapPoint} | null>(null)
const activePartSnapPoint = ref<{partId: string, snapPoint: SnapPoint} | null>(null)

const searchConnection = useThrottleFn((basePartId: string ,excludeBoard?: boolean) => {
  activeBaseSnapPoint.value = null
  activePartSnapPoint.value = null


  const basePart = partRefs.value?.find(part => part.id === basePartId)
  const basePartData = parts.value.find(part => part.id === basePartId)

  if (!basePart || !basePartData || basePartData?.group) {
    return;
  }

  const basePartSnapPoints = basePart.getSnapPoints()

  let closestPart: PartInstance | null = null
  let closestSnap: SnapPoint | null = null
  let closestDistance = Infinity
  let closestBaseSnap: SnapPoint | null = null

  basePartSnapPoints.forEach(snapPoint => {
    partRefs.value?.filter(part => part.id !== basePartId).forEach(part => {
      const partSnapPoints = part.getSnapPoints()
        .filter(
          (partSnapPoint) =>
            canConnectByDirection(snapPoint.direction, partSnapPoint.direction, snapPoint.type, partSnapPoint.type)
            && canConnectByType(snapPoint.type, partSnapPoint.type) && (!excludeBoard || part.partType !== 'board')
        )

      if (partSnapPoints.length === 0) {
        return
      }

      const snapPointsSorted = partSnapPoints.toSorted((a, b) => {
        const distance1 = Math.sqrt(Math.pow(a.x - snapPoint.x, 2) + Math.pow(a.y - snapPoint.y, 2))
        const distance2 = Math.sqrt(Math.pow(b.x - snapPoint.x, 2) + Math.pow(b.y - snapPoint.y, 2))
        return distance1 - distance2
      })

      const closest = snapPointsSorted[0]
      if (!closest) {
        return;
      }
      const distance = Math.sqrt(Math.pow(closest.x - snapPoint.x, 2) + Math.pow(closest.y - snapPoint.y, 2))
      if (distance < closestDistance) {
        closestBaseSnap = snapPoint
        closestDistance = distance
        closestPart = part
        closestSnap = closest
      }
    })
  })

  if (closestDistance <= snapDistance && closestPart) {
    basePart.highlightSnapPoint(closestBaseSnap!.id)
    closestPart.highlightSnapPoint(closestSnap!.id)
    activeBaseSnapPoint.value = { partId: basePartId, snapPoint: closestBaseSnap! }
    activePartSnapPoint.value = { partId: closestPart.id, snapPoint: closestSnap! }
  } else {
    basePart.highlightSnapPoint(null)
    if (closestPart) {
      closestPart.highlightSnapPoint(null)
  }

/*     activeBaseSnapPoint.value = null
    activePartSnapPoint.value = null */
  }

}, 200)

const selectedItemGroup = ref<string | null>(null)
const selectedPart = ref<string | null>(null)

const onPartClicked = (partId: string) => {

  const partData = parts.value.find(part => part.id === partId)
  if (!partData) {
    return
  }
  if(partData.group) {
    if(selectedItemGroup.value === partData.group) {
      selectedPart.value = partId;
      selectedItemGroup.value = null
    } else {
      selectedPart.value = null;
      selectedItemGroup.value = partData.group
    }
  } else {
       
    selectedItemGroup.value = null
    selectedPart.value = partId
   // moveBoardsToTop()
    movePartToTop(partId) 

  }

}

const movePartToTop = async (partId: string) =>{
    await nextTick()
  partRefs.value?.find((r)=>r.id === partId)?.node.moveToTop()
}

const removePartFromGroup = (id: string) => {

  const partData = parts.value.find(p => p.id === id)
  if (!partData) return;

  const groupName = partData.group
  partData.group = undefined

  if (groupName) {

    if (!groups.value[groupName]) {
      console.error('Group data not found')
      return
    }
    groups.value[groupName] = groups.value[groupName].filter(g => g.part.id !== selectedPart.value)

    if ((groups.value[groupName].length ?? 0) <= 1) {
      groups.value = Object.fromEntries(Object.entries(groups.value).filter(([key]) => key !== groupName))
      parts.value.filter(part => part.group === groupName).forEach(part => {
        part.group = undefined
      })
    }
  }

}

const snapPart = (basePart: PartInstance, targetPart: PartInstance, baseSnapPoint: SnapPoint, targetSnapPoint: SnapPoint ) => {
    basePart.node.setAbsolutePosition({
        x: targetSnapPoint.x + baseSnapPoint.offsetToParent.x, 
        y: targetSnapPoint.y  + baseSnapPoint.offsetToParent.y
    })
    basePart.highlightSnapPoint(null)
    targetPart.highlightSnapPoint(null)
}
        const groupRef = useTemplateRef<VueKonvaRef<Group>>('groupRef')
const onGroupDragging =(isDragging: boolean, group: GroupData) => {

  if(isDragging && selectedPart.value && !selectedItemGroup.value && group.some(p => p.part.id === selectedPart.value)) {
      const partData = parts.value.find(p => p.id === selectedPart.value)
      if(!partData) {
        console.error('onGroupDragging: Part data not found')
          return
      }
      removePartFromGroup(selectedPart.value)
  } 
}

const onDragging = (isDragging: boolean, partId: string, disableHighlightSearch?: boolean) => {
    if(isDragging && !disableHighlightSearch) {  
        searchConnection(partId, true)
    } else if (!isDragging) {
        searchConnection(partId)
        if(!activeBaseSnapPoint.value || !activePartSnapPoint.value){

            return;
        }
        const basePart = partRefs.value?.find(part => part.id === activeBaseSnapPoint.value?.partId)
          if(!basePart) {
            return
          }
        const snapToPart = partRefs.value?.find(part => part.id === activePartSnapPoint.value?.partId)
        if(!snapToPart) {
            return
        }

        snapPart(basePart, snapToPart, activeBaseSnapPoint.value.snapPoint, activePartSnapPoint.value.snapPoint)

        const basePartData = parts.value.find(part => part.id === basePart?.id)
        if(!basePartData) {
          console.error('Base part data not found')
            return
        }

        const closestPartData = parts.value.find(part => part.id === activePartSnapPoint.value?.partId)
        if(!closestPartData) {
            console.error('Closest part data not found')
            return
        }

        if(closestPartData.group){
          const groupName = closestPartData.group
          if(!groups.value[groupName]) {
            console.error('Group data not found')
            return
          }
          basePartData.group = groupName

          groups.value[groupName] = [
            ...groups.value[groupName] ?? [],
            {part: basePartData, node: basePart.node, componentRef: basePart}
          ]
          selectedItemGroup.value = groupName
          selectedPart.value = null

          return
        }

        const groupName = `group-${crypto.randomUUID()}`

        basePartData.group = groupName

        closestPartData.group = groupName
        
        groups.value[groupName] = [
            {part: basePartData, node: basePart.node, componentRef: basePart},
            {part: closestPartData!, node: snapToPart?.node, componentRef: snapToPart},
        ]

        selectedItemGroup.value = groupName
        selectedPart.value = null

    }
}

const mainGroupRef = useTemplateRef<VueKonvaRef<Group>>('mainGroup')
const mainGroupNode = computed(() => mainGroupRef.value?.getNode()!)

const onStageClicked = (e: KonvaPointerEvent) => {
    if(e.target === e.target.getStage()) {
        selectedPart.value = null
        selectedItemGroup.value = null
        moveBoardsToTop()
    }
}

const moveBoardsToTop = async() => {
  await nextTick()
  partRefs.value?.filter((ref) => ref.partType === 'board').forEach((ref) => {
    ref.node.moveToTop()
  })

}


onKeyStroke
  ('r', (e) => {
    if (selectedPart.value) {
      const isInGroup = !!parts.value.find((p)=> p.id === selectedPart.value)?.group
      if(isInGroup) return;
      const part = partRefs.value?.find(part => part.id === selectedPart.value)
      if (part && part.rotate) {
        part.rotate()
      }
    }
    e.preventDefault()
  })



onKeyStroke
  ('Delete', (e) => {
    if (selectedPart.value && !selectedItemGroup.value) {
      removePartFromGroup(selectedPart.value);
      parts.value = parts.value.filter((p) => p.id !== selectedPart.value)
    } else if (!selectedPart.value && selectedItemGroup.value) {
      if (confirm('Do you really want to delete the whole group?')) {
        const partsFiltered = parts.value.filter(p => p.group !== selectedItemGroup.value)
        parts.value.filter(p => p.group === selectedItemGroup.value).forEach((p) => {
          removePartFromGroup(p.id)
        })
        parts.value = partsFiltered
      }
    }
    e.preventDefault()
  })


const {setLayer} = useConnectorLayer()
const connectorLayer = useTemplateRef<VueKonvaRef<Layer>>('connectorLayer');

watch(connectorLayer,()=>{
  if(connectorLayer.value?.getNode()) {
    setLayer(connectorLayer.value?.getNode())
  }
},{once: true})

const addPart = (part: AddPartData)=>{
  if(!part.initialPosition) {
    console.log(canvasConfig)
    part.initialPosition=  {
      x: (canvasConfig.value.width ?? 0) / 2,
      y: (canvasConfig.value.height ?? 0) / 2
    }
  }
  parts.value.push({
    ...part,
    id: crypto.randomUUID(),
  })
}

const stageRef = useTemplateRef<VueKonvaRef<Stage>>('stage')

const handleWheel = (e: KonvaPointerEvent) => {
  if(!stageRef.value) {
    console.error('Stage ref not found')
    return
  };
  e.evt.preventDefault();

  const stage = stageRef.value?.getNode();
  const oldScale = stage.scaleX();
  const pointer = stage.getPointerPosition();

  if(!pointer) {
    console.error('stage.getPointerPosition is undefined')
    return
  };

  const mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  // how to scale? Zoom in? Or zoom out?
  let direction = e.evt.deltaY > 0 ? -1 : 1;

  // when we zoom on trackpad, e.evt.ctrlKey is true
  // in that case lets revert direction
  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  const scaleBy = 1.07;
  const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  const newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
};

defineExpose({
  addPart
});

</script>

<template>
  <div>
    <v-stage 
        ref="stage" 
        :config="canvasConfig"
         @wheel="handleWheel"
        @click="onStageClicked"
        >
        <v-layer
          id="connectorLayer"
          ref="connectorLayer"
        />
        <v-layer >
            <ItemGroup v-for="(group, id) in groups" :key="id" 
              ref="groupRef" 
              :id="id" 
              :group-data="group"  
              :main-group-node="mainGroupNode" 
              :drag-disabled="selectedItemGroup!==id"
              @dragging="(isDragging) =>onGroupDragging(isDragging, group)"
            />
            <v-group ref="mainGroup">
                <template v-for="part in parts" :key="part.id">
                    <ItemBeam 
                        v-if="part.partType === 'beam'"
                        ref="partRef"
                        :id="part.id" 
                        :lenght="part.length ?? 7" 
                        :type="part.beamType ?? 'male-female'" 
                        :snap-type="part.snapType ?? 'regular'"
                        :dragging-disabled="selectedPart !== part.id"
                        :selected="selectedPart === part.id || selectedItemGroup === part.group"
                        @dragging="(isDragging) =>onDragging(isDragging, part.id)"
                        :initial-position="part.initialPosition"
                        @clicked="onPartClicked(part.id)"
                    />
                    <ItemBoard 
                      v-if="part.partType === 'board'"
                      ref="partRef"
                      :id="part.id"
                      :height="part.height ?? 8"
                      :width="part.width ?? 8"
                      :dragging-disabled="selectedPart !== part.id"
                      :selected="selectedPart === part.id || selectedItemGroup === part.group"
                      @dragging="(isDragging) =>onDragging(isDragging, part.id, true)"
                      :initial-position="part.initialPosition"
                      @clicked="onPartClicked(part.id)"
                    />
                    <ItemClamp
                      v-if="part.partType === 'clamp'"
                      ref="partRef"
                      :id="part.id"
                      :initial-position="part.initialPosition"
                      :dragging-disabled="selectedPart !== part.id"
                      :selected="selectedPart === part.id || selectedItemGroup === part.group"
                      @dragging="(isDragging) =>onDragging(isDragging, part.id)"
                      @clicked="onPartClicked(part.id)"/>
                    <ItemCorner
                      v-if="(part.partType === '4-way-corner' || part.partType === '3-way-corner' || part.partType === '2-way-corner') && part.snapType !== 'quad'"
                      ref="partRef"
                      :id="part.id"
                      :type="part.partType",
                      :snap-type="part.snapType"
                      :initial-position="part.initialPosition"
                      :dragging-disabled="selectedPart !== part.id"
                      :selected="selectedPart === part.id || selectedItemGroup === part.group"
                      @dragging="(isDragging) =>onDragging(isDragging, part.id)"
                      @clicked="onPartClicked(part.id)"
                    />
                </template>
            </v-group>
        </v-layer>
    </v-stage>
    </div>
</template>
