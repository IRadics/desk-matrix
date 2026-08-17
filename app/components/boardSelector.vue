<script setup lang="ts">
const getCoordinate = (index: number) => {
    const y = Math.floor((index - 1) / 12) + 1;
    const x = ((index - 1) % 12) + 1;
    return { x, y }
}

const coordinate = ref<{ x: number, y: number } | null>(null)

const onMouseOver = (index: number) => {
    coordinate.value = getCoordinate(index)
}



const highlightedIndices = computed(() => {
    if (!coordinate.value) return [];
    const indices: number[] = []
    for (let y = 1; y <= coordinate.value.y; y++) {
        for (let x = 1; x <= coordinate.value.x; x++) {
            indices.push((y - 1) * 12 + x);
        }
    }
    return indices;
})

const selectSize = () =>{
    if(!coordinate.value) return;
    emit('selected',coordinate.value)
}

const emit = defineEmits<{
    selected: [size: {x: number, y: number}]
}>()

</script>
<template>
    <div  class="flex justify-center font-bold text-lg">{{ coordinate?.x }} {{ coordinate ? 'X' : '' }} {{
        coordinate?.y }}
    </div>
    <div class="grid grid-cols-12 gap-2 p-2" @click="selectSize">
        <div v-for="i in 12 * 12" class="aspect-square! h-5 w-5 bg-gray-700 octa" :class="{
            'bg-gray-400!': highlightedIndices.includes(i)
        }" @mouseover="onMouseOver(i)">

        </div>
    </div>
</template>
<style lang="css" scoped>
.octa {
    --o: calc(50%*tan(-22.5deg));
    clip-path: polygon(var(--o) 50%, 50% var(--o),
            calc(100% - var(--o)) 50%,
            50% calc(100% - var(--o)));
}
</style>