<script lang="ts" setup>
const props = defineProps({
    parts: {
        type: Object as PropType<Part[]>,
        required: true
    },
})

const partData = computed(()=>{
    const part = props.parts[0]
    if(!part) return {
        type: ''
    };

    if(part.partType === 'clamp') {
        return {
            type: part.partType,
            icon: 'i-custom-clamp'
        }
    }
    if(part.partType === 'board') {
        return {
            type: part.partType,
            specs: `${part.width} x ${part.height}`,
            icon: 'i-custom-board'
        }
    }
    if(part.partType === 'beam') {
        return {
            type: part.partType,
            specs: `${part.beamType} - ${part.length}x - ${part.snapType}`,
            icon: `i-custom-beam-${part.beamType}-${part.snapType}`
        }
    }
    if(part.partType === '2-way-corner' || part.partType === '3-way-corner' || part.partType === '4-way-corner') {
        return {
            type: part.partType,
            specs: `${part.snapType}`,
            icon: `i-custom-${part.partType}-${part.snapType}`
        }
    }
})


</script>
<template>
    <div class="flex flex-col py-2 px-4 h-28">
        <div class="flex gap-2">
            <div class="flex justify-center items-center w-12">
                <UIcon :name="partData?.icon" :size="60"/>
            </div>
            <div class="flex flex-col">
                <div class="font-bold">{{ partData?.type }}</div>
                <div>{{ partData?.specs }}</div>
            </div>
        </div>
        <div class="ms-auto mt-auto text-lg font-bold">{{ parts.length }}x</div>
    </div>
</template>