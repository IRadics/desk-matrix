<script lang="ts" setup>

useSeoMeta({
    title: 'DeskMatrix',
    ogTitle: 'DeskMatrix',
    description: 'Desk mounted solution for MultiBoard',
    ogDescription: 'Desk mounted solution for MultiBoard',
    ogImage: '/thumbnail.png'
})

const supportModalOpen = ref<boolean>(false)
const licenseModalOpen = ref<boolean>(false)


</script>
<template>
    <div class="flex w-full h-dvh justify-center items-center">
    <UPageHero
        :ui="{
            container: 'py-10 sm:py-14! lg:py-18!',
            root:'w-full bg-[var(--ui-color-neutral-800)]',
        }"
        title="Desk Mounted Framework for MultiBoard"
        >
        <template #description>
            <div class="flex flex-col gap-10">
                <div class="flex flex-col gap-1">
                    <span>A multi piece desk mounted solution for MultiBoard, which provides a stable structure for the desk mount to minimize flexing.</span>
                    <span>A comprehensive alternative system to wall mounting.</span>
                    <span>Available on MakerWorld</span>
                </div>
                <div class="flex gap-4 justify-center items-center">
                    <UButton 
                        label="DeskMatrix Planner"
                        to="/planner"
                        color="primary"
                        icon="i-lucide-grid-3x3"
                        class="py-4 px-6 text-xl font-bold justify-center"
                        size="xl"
                    />
                    <UButton 
                        label="Download from MakerWorld"
                        to="https://makerworld.com/en/models/9031310"
                        target="_blank"
                        icon="i-custom-maker-world"
                        class="[&_svg]:text-white! py-4 px-6 text-xl font-bold justify-center"
                        size="xl"
                        variant="outline"
                    />
                </div>
                
            </div>
        </template>
        <template #headline>
            <div class="flex w-full  justify-center">
                <UIcon  name="i-custom-logo" :size="140"/>
            </div>
        </template>
        <template #bottom>
            <div class="flex justify-center">
                <UButton 
                    label="Support me"
                    icon="i-lucide-heart-plus" 
                    size="xl" 
                    class="px-6 justify-center "
                    variant="ghost"

                    @click="supportModalOpen = true"
                />
                <UButton 
                    label="License"
                    icon="i-lucide-creative-commons" 
                    size="xl" 
                    class="px-6 justify-center"
                    variant="ghost"
                    @click="licenseModalOpen = true"
                />
            </div>
            <div class="flex justify-center w-full italic text-white/50 my-2">
                <span>DeskMatrix is an independent, unofficial community project. It is not affiliated with, sponsored by, or endorsed by MultiBuild, Multiboard LTD, or Keep Making.</span>
            </div>

        </template>
    </UPageHero>
    <SupportDialog  v-model:open="supportModalOpen"/>
    <LicenseDialog  v-model:open="licenseModalOpen"/>
  </div>
</template>