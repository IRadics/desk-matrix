<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const sideBarOpen = ref<boolean>(true)

const props = defineProps({
    parts: {
        type: Array as PropType<Part[]>,
        required: true
    }
})

const partsGroupedDmf = computed(()=>{
    return groupParts(props.parts,['2-way-corner', '3-way-corner', '4-way-corner', 'beam', 'clamp'])
})
const partsGroupedMb = computed(()=>{
    return groupParts(props.parts,['board'])
})

const partsGroupedDmfCount =  computed(()=>partsGroupedDmf.value.flatMap((v)=>v).length)
const partsGroupedMbCount =  computed(()=>partsGroupedMb.value.flatMap((v)=>v).length)

const items = computed<AccordionItem[]>(()=>[
    {
        label: 'DMF parts',
        icon: 'i-lucide-triangle',
        slot: 'dmf-parts',
        itemCount: partsGroupedDmfCount.value,
    },
    {
        label: 'MultiBoard parts',
        icon: 'i-lucide-octagon',
        slot: 'multiboard-parts',
        itemCount: partsGroupedMbCount.value
    },
    {
        label: 'Bolts',
        icon: 'i-lucide-bolt',
    },
])

</script>
<template>
    <div class="flex flex-1">
        <USidebar 
            v-model:open="sideBarOpen" 
            collapsible="icon" 
            close
            :ui="{
                container: 'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]',
                inner: 'bg-elevated/25 bg-gray-700',
                body: 'py-0 px-0',
                gap: 'h-[calc(100%-var(--ui-header-height))]',
            }"
        >   
            <template #header="{close, open}">
                <div class="flex w-full">
                    <div v-if="open" class="text-lg font-bold  w-full">Bill of Materials</div>
                    <UButton v-if="open" icon="i-lucide-chevron-left" @click="close"></UButton>
                    <UButton v-if="!open" icon="i-lucide-chevron-right" @click="sideBarOpen = true"></UButton>
                </div>
            </template>
            <template v-if="sideBarOpen" >
                <UAccordion :items="items" type="multiple" :ui="{
                    header: 'px-2'
                }">
                    <template #default="{item}">
                        <div class="flex gap-2">
                            <span>{{ item.label }} </span>
                            <UBadge  
                                v-if="item.itemCount"
                                class="font-bold rounded-full aspect-square h-5 flex justify-center" 
                                size="sm" 
                                :label="item.itemCount"
                            />
                        </div>

                    </template>
                    <template #dmf-parts>
                        <div class="divide-y">
                            <template v-if="partsGroupedDmf.length">
                                <SideBarPart v-for="groupedParts in partsGroupedDmf" :parts="groupedParts"/>
                            </template>
                            <template v-else>
                                <div class="ms-4 py-4 italic text-sm opacity-70">
                                    Add parts and they will be listed here
                                </div>
                            </template>
                        </div>
                    </template>
                    <template #multiboard-parts>
                        <div class="divide-y">
                            <template  v-if="partsGroupedMb.length">
                                <SideBarPart v-for="groupedParts in partsGroupedMb" :parts="groupedParts"/>
                            </template>
                            <template v-else>
                                <div class="ms-4 py-4 italic text-sm opacity-70">
                                    Add parts and they will be listed here
                                </div>
                            </template>
                        </div>
                    </template>
                </UAccordion>
            </template>
            <template v-else>
                <div class="flex flex-col gap-8 items-center py-4">
                    <div class="flex items-center gap-2" v-for="item in items">
                        <UIcon :name="item.icon"></UIcon>
                        <UBadge 
                            class="font-bold rounded-full aspect-square h-5 flex justify-center " 
                            :class="{
                                'bg-gray-500': (item.itemCount ?? 0) === 0
                            }"
                            size="sm" 
                            :label="item.itemCount ?? 0"
                        />
                    </div>
                </div>
            </template>
        </USidebar>
    </div>
</template>