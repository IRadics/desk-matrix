<script lang="ts" setup>
import type { ContextMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { type Vector2d } from 'konva/lib/types'

const canvas = useTemplateRef('canvas')

const regularSizes = [3, 4, 5, 6, 7, 8, 9, 10, 11]
const quadSizes = [3, 5, 7, 9, 11]

const connectors : Part['beamType'][]= ['male-male', 'male-female' ,'female-male' ,'female-female']
const snapTypesBeam: Part['snapType'][] = ['regular', 'quad']

const corners : Part['partType'][] = ['2-way-corner', '3-way-corner', '4-way-corner']
const snapTypesCorner: Part['snapType'][] = ['none', 'regular']

const addPart= (part: AddPartData) =>{
    const initialPosition = part.partType === 'board' ? boardModalClickPos.value  : contextMenuClickPos.value
    if(!canvas.value) return;
    canvas.value.addPart({
        ...part,
        ...(initialPosition ? {initialPosition: initialPosition} : {} )
    })
}


const beamDropdownItems = ref<DropdownMenuItem[][]>([[]])
beamDropdownItems.value[0]?.push(({
    label: 'Connector type',
    type: 'label'
}))
connectors.forEach(con =>{
     beamDropdownItems.value[0]?.push(({
        label: con,
        children: [
            {
                label: 'Snap type',
                type: 'label'
            } , 
        ...snapTypesBeam.map((snap)=>({
            label: snap,
            children: [
                {
                    label: 'Length',
                    type: 'label'
                } as DropdownMenuItem,
                ...(snap === 'quad' ?
                quadSizes.map((l)=>({
                    label: `${l}x`,
                    onClick: () => addPart({
                        partType: 'beam',
                        length: l,
                        snapType: snap,
                        beamType: con,
                    }),
                })):
                regularSizes.map((l)=>({
                    label: `${l}x`,
                    onClick: () => addPart({
                        partType: 'beam',
                        length: l,
                        snapType: snap,
                        beamType: con,
                    }),
                })))]
        }))]
     }))
})


const cornerDropdownItems = ref<DropdownMenuItem[][]>([[]])
cornerDropdownItems.value[0]?.push(({
    label: 'Type',
    type: 'label'
}))
corners.forEach(con =>{
    cornerDropdownItems.value[0]?.push(({
        label: con,
        children: [
            {
                label: 'Snap type',
                type: 'label'
            },
        ...snapTypesCorner.map((snap)=>({
            label: snap,
            onClick: ()=> addPart({
                partType: con,
                snapType: snap,
            })
        }))]
    }))
})


const boardDialogOpen = ref<boolean>(false)
const items = ref<ContextMenuItem[]>([
    [
        {
            label: 'Add part',
            children: [
                {
                    label: 'Beam',
                    children: beamDropdownItems
                },
                {
                    label: 'Corner',
                    children: cornerDropdownItems
                },
                {
                    label: 'Clamp',
                    onClick: ()=>addPart({
                        partType: 'clamp'
                    })
                },
                {
                    label: 'Board',
                    onClick: () => {
                        boardDialogOpen.value = true;
                        boardModalClickPos.value = contextMenuClickPos.value 
                    }
                }
            ]
        }
    ],
])

const contextMenuClickPos = ref<Vector2d | null>(null)
const boardModalClickPos = ref<Vector2d | null>(null)
const onContextMenuOpen = (open: boolean) => {
    if (!open) {
        contextMenuClickPos.value = null;
        return;
    }
    contextMenuClickPos.value = canvas.value?.stageNode?.getRelativePointerPosition() ?? null
}

</script>
<template>
    <div class=" bg-gray-800">
        <UHeader 
        :ui="{
            container: 'max-w-none!',
            center: 'flex gap-2'
        }">
            <template #title>MultiBoard DMF</template>
            <template #default>
                <UDropdownMenu :items="beamDropdownItems">
                    <UButton 
                        size="xl"
                        leading-icon="i-lucide-plus" 
                        trailing-icon="i-lucide-chevron-down"  
                        variant="outline">Beam</UButton>
                </UDropdownMenu>
                <UDropdownMenu :items="cornerDropdownItems">
                    <UButton 
                        size="xl"
                        leading-icon="i-lucide-plus" 
                        trailing-icon="i-lucide-chevron-down" 
                        variant="outline"
                        >Corner
                    </UButton>
                </UDropdownMenu>
                <UButton 
                    size="xl"
                    variant="outline"
                    leading-icon="i-lucide-plus" 
                    @click="addPart({
                    partType:'clamp'
                })">Clamp</UButton>
                <UDropdownMenu>
                    <UButton
                    size="xl"
                    variant="outline"
                    leading-icon="i-lucide-plus" > Board</UButton>
                    <template #content-bottom>
                        <BoardSelector @selected="(size)=>{
                            addPart({
                                partType: 'board',
                                height: size.y,
                                width: size.x
                            })
                        }"/>
                    </template>
                </UDropdownMenu>
            </template>
        </UHeader>
        <UContextMenu :items="items" @update:open="onContextMenuOpen">
            <Canvas ref="canvas" />
        </UContextMenu>
        <UModal v-model:open="boardDialogOpen" class="w-fit">
            <template #content>
                <BoardSelector 
                    @selected="(size)=>{
                            addPart({
                                partType: 'board',
                                height: size.y,
                                width: size.x,
                            });
                            boardDialogOpen = false
                        }"/>
            </template>
        </UModal>
    </div>
</template>y