<script lang="ts" setup>
import type { ContextMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { type Vector2d } from 'konva/lib/types'
import { Canvas } from '#components'

useSeoMeta({
    title: 'DeskMatrix Planner',
    ogTitle: 'DeskMatrix Planner',
    description: 'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
    ogDescription: 'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
    ogImage: '/thumbnail.png',
})

const canvas = useTemplateRef<InstanceType<typeof Canvas>>('canvas')
const toast = useToast()

const parts = computed<Part[]>((): Part[] => {
    return canvas.value?.parts ?? []
})

const regularSizes = [3, 4, 5, 6, 7, 8, 9, 10, 11]
const quadSizes = [3, 5, 7, 9, 11]

const connectors : Part['beamType'][]= ['male-male', 'male-female' ,'female-male' ,'female-female']
const snapTypesBeam: Part['snapType'][] = ['regular', 'quad']

const corners : Part['partType'][] = ['2-way-corner', '3-way-corner', '4-way-corner']
const snapTypesCorner: Part['snapType'][] = ['none', 'regular']

const addPart= (part: AddPartData, position?: Vector2d) =>{
    const initialPosition = position ?? (part.partType === 'board' ? boardModalClickPos.value  : contextMenuClickPos.value)
    if(!canvas.value) return;
    canvas.value.addPart({
        ...part,
        ...(initialPosition ? {initialPosition: initialPosition} : {} ),
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
        icon: `i-custom-beam-${con}-regular`,
        children: [
            {
                label: 'Snap type',
                type: 'label'
            } , 
        ...snapTypesBeam.map((snap)=>({
            label: snap,
            icon: `i-custom-beam-${con}-${snap}`,
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
    type: 'label',
}))
corners.forEach(con =>{
    cornerDropdownItems.value[0]?.push(({
        label: con,
        icon: `i-custom-${con}-none`,
        children: [
            {
                label: 'Snap type',
                type: 'label',
            },
        ...snapTypesCorner.map((snap)=>({
            label: snap,
            icon: `i-custom-${con}-${snap}`,
            onClick: ()=> addPart({
                partType: con,
                snapType: snap,
            })
        }))]
    }))
})
const boardDialogOpen = ref<boolean>(false)
const copiedPartData = ref<Part | null>(null)
const selectedPartData = computed<Part>((): Part=>{
    return canvas.value?.selectedPartData as Part
})
const copySelectedPart = () =>{
    if(selectedPartData.value) {
        copiedPartData.value = selectedPartData.value
        toast.add({
            title: 'Part copied',
            duration: 1000,
            progress: false
        })
    }
    
}
const pastePart = () =>{
    if(copiedPartData.value) {
        const rotation = canvas.value?.selectedPartState.rotation ?? 0
        addPart(
            {
                ...copiedPartData.value,
                initialRotation: rotation
            }, 
            canvas.value?.stageNode?.getRelativePointerPosition() ?? undefined
        )
        toast.add({
            title: 'Part pasted',
            duration: 1000,
            progress: false
        })
    }
}

onKeyStroke(['c', 'meta'],(e)=>{
    e.preventDefault()
    copySelectedPart()
},{
    dedupe: true
})
onKeyStroke(['v', 'meta'],(e)=>{
    e.preventDefault()
    pastePart()
},{
    dedupe: true
})
const items = computed<ContextMenuItem[][]>(() => [
    [
        {
            label: 'Add part',
            children: [
                {
                    label: 'Beam',
                    children: beamDropdownItems.value,
                    icon: 'i-custom-beam-female-male-regular'
                },
                {
                    label: 'Corner',
                    children: cornerDropdownItems.value,
                    icon: 'i-custom-2-way-corner-none'
                },
                {
                    label: 'Clamp',
                    icon: 'i-custom-clamp',
                    onClick: ()=>addPart({
                        partType: 'clamp'
                    })
                },
                {
                    label: 'Board',
                    icon: 'i-custom-board',
                    onClick: () => {
                        boardDialogOpen.value = true;
                        boardModalClickPos.value = contextMenuClickPos.value 
                    }
                }
            ]
        },
        ...(canvas.value?.canRotateSelectedPart ?[ {
            label: 'Rotate',
            kbds: ['r'],
            onClick: ()=> canvas.value?.rotateSelectedPart()
        }] : []),
        ...(selectedPartData.value ?[ {
            label: 'Copy',
            kbds: ['meta', 'c'],
            onClick: ()=> copySelectedPart()
        }] : []),
        {
            disabled: !copiedPartData.value,
            label: 'Paste',
            kbds: ['meta', 'v'],
            onClick: ()=> pastePart()
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

const menuUiConfig = {
    item: 'flex items-center',
    itemLeadingIcon: 'h-12 w-12'
}
</script>
<template>
    <div class=" bg-gray-800">
        <SideBar :parts="parts"/>
        <div class="flex gap-2 h-(--ui-header-height) bg-neutral-900 items-center px-2 md:px-8 justify-center">
            <UIcon class=" h-[60px] mr-auto shrink-0 hidden md:block" :size="60" name="i-custom-logo" />
            <UIcon class=" h-[60px] mr-auto shrink-0 block md:hidden py-2" :size="60" name="i-custom-logo-small" />
            <div class="mx-auto flex gap-2">
                <UDropdownMenu :items="beamDropdownItems" :ui="menuUiConfig" size="xl" >
                    <UButton 
                        size="xl"
                        trailing-icon="i-lucide-chevron-down"  
                        variant="outline"
                        style=" --tw-ring-color: var(--ui-primary)"
                        class="gap-0 md:gap-2 px-2 md:px-3"
                        >
                        <template #leading>
                            <div class="aspect-square w-8 flex justify-center items-center">
                                 <UIcon name="i-custom-beam-female-male-regular" :size="32"/>
                            </div>
                        </template>
                        <template #default>
                            <span class="hidden lg:block">Beam</span>
                        </template>
                    </UButton>
                </UDropdownMenu>
                <UDropdownMenu :items="cornerDropdownItems" :ui="menuUiConfig" size="xl" >
                    <UButton 
                        size="xl"
                        trailing-icon="i-lucide-chevron-down" 
                        variant="outline"
                        style=" --tw-ring-color: var(--ui-primary)"
                        class="gap-0 md:gap-2 px-2 md:px-3"
                        >
                        <template #leading>
                            <div class="aspect-square w-8 flex justify-center items-center">
                                 <UIcon name="i-custom-2-way-corner-none" :size="32"/>
                            </div>
                        </template>   
                        <template #default>
                            <span class="hidden lg:block">Corner</span>
                        </template>
                    </UButton>
                </UDropdownMenu>
                <UButton 
                    size="xl"
                    variant="outline"
                    leading-icon="i-lucide-plus" 
                    style=" --tw-ring-color: var(--ui-primary)"
                    class="gap-0 md:gap-2 px-2 md:px-3"
                    @click="addPart({
                    partType:'clamp'
                    
                })">
                    <template #leading>
                        <div class="aspect-square w-8 flex justify-center items-center">
                            <UIcon name="i-custom-clamp" :size="32"/>
                        </div>
                    </template>   
                    <template #default>
                        <span class="hidden lg:block">Clamp</span>
                    </template>
                </UButton>
                <UDropdownMenu>
                    <UButton
                    size="xl"
                    variant="outline"
                    leading-icon="i-lucide-plus" 
                    class="gap-0 md:gap-2 px-2 md:px-3"
                    style=" --tw-ring-color: var(--ui-primary)">
                    
                    <template #leading>
                        <div class="aspect-square w-8 flex justify-center items-center">
                            <UIcon name="i-custom-board" :size="32"/>
                        </div>
                    </template>   
                    <template #default>
                       <span class="hidden lg:block"> Board</span>
                    </template>
                </UButton>
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
            </div>
        </div>
        <UContextMenu 
            :items="items"  
            size="xl" 
            :ui="menuUiConfig"
            @update:open="onContextMenuOpen"
        >
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
</template>
<style lang="css" scoped>
:root {
    --tw-ring-color: var(--ui-primary) !important;
}
</style>