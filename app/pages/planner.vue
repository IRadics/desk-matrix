<script lang="ts" setup>
import type { ContextMenuItem, DropdownMenuItem } from '@nuxt/ui'
import { type Vector2d } from 'konva/lib/types'
import { Canvas } from '#components'

useSeoMeta({
    title: 'DeskMatrix Planner',
    ogTitle: 'DeskMatrix Planner - Plan your DeskMatrix layout and 3D print the required parts',
    description: 'Plan a custom DeskMatrix layout and calculate the beams, corners, clamps, boards and bolts required for your desk-mounted MultiBoard.',
    ogDescription: 'Plan a custom DeskMatrix layout and calculate the beams, corners, clamps, boards and bolts required for your desk-mounted MultiBoard.',
    ogImage: '/thumbnail.png',
})

const canvas = useTemplateRef<InstanceType<typeof Canvas>>('canvas')
const toast = useToast()
const { boardVisibility, setBoardVisibility, visibilityItems, beamVisibility, setBeamVisibility } = useItemSettings()
const { sideBarOpen } = useSideBar()

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
        },
        ...(canvas.value?.canDeleteSelectedPart ?[{
            label: 'Delete',
            kbds: ['Delete'],
            color: 'error',
            onClick: ()=> canvas.value?.deleteSelectedPart()
        }] : []),
    ] as ContextMenuItem[],
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

useEventListener(window, 'beforeunload', (event) => {
    if (parts.value.length > 0) {
        event.preventDefault()
        // Modern browsers require setting returnValue to a blank string or true
        event.returnValue = ''
    }
})

onBeforeRouteLeave(async (to, from) => {
  if (parts.value.length > 0) {
    const confirmLeave = window.confirm('The changes you have made will be lost. Are you sure you want to leave?')
    if (!confirmLeave) {
      return false // Aborts the internal router navigation
    }
  }
})

</script>
<template>
    <div class=" bg-neutral-500">
        <SideBar :parts="parts" v-model="sideBarOpen"/>
        <div class="flex gap-2 h-(--ui-header-height) bg-neutral-900 items-center px-2 md:px-8 justify-center">
            <NuxtLink class="mr-auto shrink-0 hidden md:block" to="/" aria-label="DeskMatrix home">
                <UIcon class="h-[60px]" :size="60" name="i-custom-logo" />
            </NuxtLink>
            <NuxtLink class="mr-auto shrink-0 block md:hidden" to="/" aria-label="DeskMatrix home">
                <UIcon class=" h-[60px] py-2" :size="60" name="i-custom-logo-small" />
            </NuxtLink>
            <div class="me-auto flex gap-2">
                <UDropdownMenu :items="beamDropdownItems" :ui="menuUiConfig" size="xl" >
                    <UButton 
                        aria-label="Add beam"
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
                        aria-label="Add corner"
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
                    aria-label="Add clamp"
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
                <UDropdownMenu :items="[{
                    class: 'before:bg-transparent!',
                }]" ref="boardselect">
                    <UButton
                        aria-label="Add board"
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
                    <template #item>
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
        <UCollapsible 
            class="absolute top-(--ui-header-height) z-50 flex flex-col w-80 transition-all ease-out duration-200" 
            :class="{
                'left-(--sidebar-width)': sideBarOpen,
                'left-(--sidebar-width-icon)': !sideBarOpen,
            }"
        >
            <UButton
                label="Part visibility"
                color="neutral"
                variant="subtle"
                class="group bg-neutral-900/50 rounded-none "
                trailing-icon="i-lucide-chevron-down"
                :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
                block
            />
            <template #content>
                <div class="bg-neutral-900/50 flex flex-col gap-2 px-4 py-2 ">
                    <USeparator label="Board" color="primary"/>
                    <URadioGroup 
                        size="sm" 
                        :ui="{
                            base: '[--tw-ring-color:var(--ui-color-primary-700)]!',
                            item: ' not-data-[state=checked]:border-primary-700 h-7 items-center',
                            fieldset: 'justify-between'
                        }"
                        orientation="horizontal" 
                        variant="card"
                        v-model:model-value="boardVisibility" 
                        :items="visibilityItems" 
                        @update:model-value="(v)=>setBoardVisibility(v as Visibility ?? Visibility.normal)"  
                    />
                    <USeparator class="mt-4" label="Frame" color="primary"/>
                    <URadioGroup 
                        size="sm" 
                        class="justify-center"
                       :ui="{
                            base: '[--tw-ring-color:var(--ui-color-primary-700)]!',
                            item: ' not-data-[state=checked]:border-primary-700 h-7 items-center',
                            fieldset: 'justify-between'
                        }"
                        orientation="horizontal" 
                        variant="card"
                        v-model:model-value="beamVisibility" 
                        :items="visibilityItems" 
                        @update:model-value="(v)=>setBeamVisibility(v as Visibility ?? Visibility.normal)"  
                    />
                </div>
            </template>
        </UCollapsible>
        <UCollapsible class="absolute top-(--ui-header-height) z-50 right-0 flex flex-col  w-50">
            <UButton
                label="Help"
                color="neutral"
                variant="subtle"
                class="group bg-neutral-900/50 rounded-none "
                trailing-icon="i-lucide-chevron-down"
                :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                }"
                block
            />

            <template #content>
            <div class="bg-neutral-900/50 flex flex-col gap-1 px-4 py-2">
                <USeparator class="mb-2" color="primary" label="Controls"/>
                <div class="flex items-center">
                    <UIcon name="i-lucide-mouse-left" class="[&_circle]:text-primary-500" :size="24" />
                    <span class="ms-auto">Select / drag</span>
                </div>
                <div class="flex items-center">
                    <UIcon name="i-lucide-mouse-right" class="[&_circle]:text-primary-500" :size="24" />
                    <span class="ms-auto">Context menu</span>
                </div>
                <div class="flex items-center">
                    <UIcon name="i-lucide-mouse" class="[&_path]:text-primary-500" :size="24" />
                    <span class="ms-auto">Zoom in / out</span>
                </div>
                <div class="flex">
                    <UBadge label="R" variant="outline" color="neutral" />
                    <span class="ms-auto">Rotate</span>
                </div>
                <div class="flex">
                    <UBadge label="CTRL" variant="outline" color="neutral"/>
                    <UBadge label="C" variant="outline" color="neutral"/>
                    <span class="ms-auto">Copy</span>
                </div>
                <div class="flex">
                    <UBadge label="CTRL" variant="outline" color="neutral"/>
                    <UBadge label="V" variant="outline" color="neutral"/>
                    <span class="ms-auto">Paste</span>
                </div>
                <div class="flex">
                    <UBadge label="DELETE" variant="outline" color="neutral"/>
                    <span class="ms-auto">Delete</span>
                </div>
                <USeparator class="mt-4 mb-2" color="primary" label="Tips"/>
                <ul class=" list-inside list-disc text-sm flex flex-col gap-1">
                    <li>Clicking on a snapped group twice selects the individual part, which you can disconnect by dragging it away</li>
                    <li>Currently you can only connect individual parts to other parts or groups. Group -> Group connection is not implemented yet</li>
                </ul>
            </div>
            </template>
        </UCollapsible>
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
