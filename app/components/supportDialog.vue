<script lang="ts" setup>

const open = defineModel('open', {
    type: Boolean,
    required: true
})

</script>
<template>
    <UModal 
    v-model:open="open" 
    title="Support my work"
    :close="{
      color: 'primary',
      variant: 'outline',
      class: 'rounded-full'
    }"
    :ui="{
        header: 'border-primary-500 '
    }"
    >
        <template #body>
            <div class="flex justify-center">
                <span class="font-bold text-center ">You can support me in the following ways: </span>
            </div>
            <div class="flex flex-col gap-4 items-center mt-6 px-10">
                <UButton size="xl" class="w-full flex justify-between" to="https://makerworld.com/en/models/9031310" target="_blank" trailing-icon="i-custom-maker-world">Boost my model on MakerWorld</UButton>
                <UButton size="xl" class="w-full flex justify-between" to="https://buymeacoffee.com/iradics" target="_blank" trailing-icon="i-lucide-pizza">Buy me a pizza</UButton>
            </div>
        </template>
    </UModal>
</template>