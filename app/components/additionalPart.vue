<script lang="ts" setup>
defineProps({
  part: {
    type: Object as PropType<AdditionalPart>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col py-2 px-4">
    <div class="flex gap-2">
      <div class="flex flex-col gap-2">
        <div class="font-bold">{{ part.partName }}</div>
        <div class="text-sm italic ms-4">{{ part.description }}</div>
        <div v-if="part.url" class="flex gap-1 items-end">
          <a class="underline text-primary-500" :href="part.url" target="_blank"
            >Thangs page
          </a>
          <UIcon
            name="i-lucide-square-arrow-out-up-right"
            class="text-primary-500"
            :size="16"
          />
        </div>
      </div>
    </div>
    <div class="ms-auto mt-auto text-lg font-bold">{{ part.quantity }}x</div>
  </div>
</template>
