<script lang="ts" setup>
import type { ContextMenuItem, DropdownMenuItem } from '@nuxt/ui'

const canvas = useTemplateRef('canvas')

const regularSizes = [3, 4, 5, 6, 7, 8, 9, 10, 11]
const quadSizes = [3, 5, 7, 9, 11]

const connectors : Part['beamType'][]= ['male-male', 'male-female' ,'female-male' ,'female-female']
const snapTypesBeam: Part['snapType'][] = ['regular', 'quad']

const corners : Part['partType'][] = ['2-way-corner', '3-way-corner', '4-way-corner']
const snapTypesCorner: Part['snapType'][] = ['none', 'regular']


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
                    onClick: () => canvas.value?.addPart({
                        partType: 'beam',
                        length: l,
                        snapType: snap,
                        beamType: con,
                    }),
                })):
                regularSizes.map((l)=>({
                    label: `${l}x`,
                    onClick: () => canvas.value?.addPart({
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
            onClick: ()=> canvas.value?.addPart({
                partType: con,
                snapType: snap,
            })
        }))]
    }))
})

const items = ref<ContextMenuItem[][]>([
    [
        {
            label: 'Add part',
            children: [
                {
                    label: 'Beam',
                },
                {
                    label: 'Corner',
                },
                {
                    label: 'Clamp',
                }
            ]
        }
    ],
])



</script>
<template>
    <div class=" bg-gray-800 ">
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
                    @click="canvas?.addPart({
                    partType:'clamp'
                })">Clamp</UButton>
                <UDropdownMenu>
                    <UButton
                    size="xl"
                    variant="outline"
                    leading-icon="i-lucide-plus" > Board</UButton>
                    <template #content-bottom>
                        <BoardSelector @selected="(size)=>{
                            canvas?.addPart({
                                partType: 'board',
                                height: size.y,
                                width: size.x
                            })
                        }"/>
                    </template>
                </UDropdownMenu>
            </template>
        </UHeader>
        <UContextMenu :items="items">
            <Canvas ref="canvas" />
        </UContextMenu>
    </div>
</template>y