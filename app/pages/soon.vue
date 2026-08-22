<script lang="ts" setup>

useSeoMeta({
    title: 'DeskMatrix',
    ogTitle: 'DeskMatrix',
    description: 'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
    ogDescription: 'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity',
    ogImage: '/thumbnail.png',
})

const supportModalOpen = ref<boolean>(false)
const licenseModalOpen = ref<boolean>(false)


</script>
<template>
    <div class="flex w-full h-dvh justify-center items-center">
    <UPageHero
        :ui="{
            container: 'py-10 sm:py-14! lg:py-18!',
            root:'w-full bg-[var(--ui-color-neutral-800)] h-fit',
        }"
        title="Desk Mounted Framework for MultiBoard"
        >
        <template #description>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-1">
                    <span class="my-8 text-6xl text-white flex gap-4 justify-center">
                        <UIcon name="i-lucide-rocket"/>
                        COMING SOON
                    </span>
                </div>
            </div>
        </template>
        <template #headline>
            <div class="flex w-full justify-center">
                <UIcon  name="i-custom-logo" :size="140"/>
            </div>
        </template>
        <template #bottom>
            <div class="flex justify-center w-full italic text-white/50 my-2 px-4">
                <span>DeskMatrix is an independent, unofficial community project. It is not affiliated with, sponsored by, or endorsed by MultiBuild, Multiboard LTD, or Keep Making.</span>
            </div>
        </template>
    </UPageHero>
    <SupportDialog  v-model:open="supportModalOpen"/>
    <LicenseDialog  v-model:open="licenseModalOpen"/>
  </div>
</template>