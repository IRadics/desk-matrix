<script lang="ts" setup>

const open = defineModel('open', {
    type: Boolean,
    required: true
})

</script>
<template>
    <UModal 
    v-model:open="open" 
    title="License"
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
            <div class="flex flex-col gap-4">

                <span>DeskMatrix is licensed on MakerWorld under <a class="text-primary-500 underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">Creative Commons Attribution-NonCommercial-ShareAlike </a></span>

                <h1 class="text-2xl">Multiboard Compatibility & Licensing</h1>

                <ul class="list-disc ms-6">
                    <li>Attribution: Based on the Multiboard system designed by Keep Making.</li>
                    <li>Official Source: Check out the full system at multiboard.io.</li>
                    <li>Components Used: Built using official, unmodified Multiboard connectors, threads, and STEP remix files.</li>
                    <li>License: This project is distributed under the official MultiBoard License terms. It is for Non-Commercial Use Only. You may not sell the digital files or the physical 3D prints of this model unless you have an active commercial agreement or partnership with Keep Making.</li>
                    <li>ShareAlike: Any further modifications or derivative works of this specific model must be shared under these exact same terms.</li>
                </ul>
            </div>
        </template>
    </UModal>
</template>