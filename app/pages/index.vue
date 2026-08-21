<script lang="ts" setup>
import type { ButtonProps } from '@nuxt/ui';

const links = ref<ButtonProps[]>([
  {
    label: 'MakerWorld',
    to: 'https://makerworld.com/en/models/9031310',
    target: '_blank',
    icon: 'i-custom-maker-world',
    class: '[&_svg]:text-white! py-4 px-6 text-xl font-bold',
    size: 'xl',
    variant: 'outline',
  },
  {
    label: 'Planner',
    to: '/planner',
    color: 'primary',
    icon: 'i-lucide-grid-3x3',
    class: '[&_svg]:text-white! py-4 px-6 text-xl font-bold',
    size: 'xl'
  }
])
</script>
<template>
    <div class="flex w-full h-dvh justify-center items-center">
    <UPageHero
        :ui="{
            root:'w-full bg-[var(--ui-color-neutral-800)]',
        }"
        title="Desk Mounted Framework for MultiBoard"
        :links="links"
        >
        <template #description>
            <div class="flex flex-col gap-1">
                <span>A multi piece desk mounted solution for MultiBoard, which provides a stable structure for the desk mount to minimize flexing.</span>
                <span>A comprehensive alternative system to wall mounting.</span>
                <span>Available on MakerWorld</span>
            </div>

        </template>
        <template #headline>
            <div class="flex w-full  justify-center">
                <UIcon  name="i-custom-logo" :size="140"/>
            </div>
        </template>
    </UPageHero>
  </div>
</template>