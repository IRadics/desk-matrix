<script lang="ts" setup>
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  onCloseFn: {
    type: Function as PropType<() => void>,
  },
})

console.log(props.onCloseFn)

const emits = defineEmits<{
  close: [value: boolean]
}>()
</script>

<template>
  <UModal
    :ui="{
      footer: 'justify-end',
    }"
    class="img-modal w-fit max-w-250"
    @leave="() => (onCloseFn ? onCloseFn() : null)"
  >
    <template #content>
      <img :src="src" class="w-full h-auto object-cover" />
      <UButton
        class="absolute top-3 right-2"
        variant="ghost"
        icon="i-lucide-x"
        @click="emits('close', false)"
      />
    </template>
  </UModal>
</template>
