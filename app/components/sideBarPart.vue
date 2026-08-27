<script lang="ts" setup>
const props = defineProps({
  parts: {
    type: Object as PropType<Part[]>,
    required: true,
  },
})

const partData = computed(() => {
  const part = props.parts[0]
  return getPartSpecs(part)
})
</script>

<template>
  <div class="flex flex-col py-2 px-4 h-28">
    <div class="flex gap-2">
      <div class="flex justify-center items-center w-12">
        <UIcon :name="partData?.icon" :size="60" />
      </div>
      <div class="flex flex-col">
        <div class="font-bold">{{ partData?.type }}</div>
        <div>{{ partData?.specs }}</div>
      </div>
    </div>
    <div class="ms-auto mt-auto text-lg font-bold">{{ parts.length }}x</div>
  </div>
</template>
