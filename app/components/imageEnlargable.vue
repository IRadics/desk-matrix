<script lang="ts" setup>
const imageDialog = useImageDialog()

defineProps({
  src: {
    type: String,
    required: true,
  },
  nativeImg: {
    type: Boolean,
    required: false,
    default: false,
  },
  width: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  animated: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const enlarged = ref<boolean>(false)
</script>

<template>
  <img
    v-if="nativeImg"
    :aria-expanded="enlarged"
    :src="src"
    aria-label="Enlarge image"
    class="w-full cursor-pointer"
    @click="
      () => {
        imageDialog({
          src,
          onCloseFn: () => {
            enlarged = false
          },
        })
        enlarged = true
      }
    "
  />
  <NuxtImg
    v-else
    :aria-expanded="enlarged"
    :src="src"
    :width="width"
    :height="height"
    aria-label="Enlarge image"
    class="w-full cursor-pointer"
    :modifiers="{
      animated: animated ? 'true' : undefined,
    }"
    @click="
      () => {
        imageDialog({
          src,
          onCloseFn: () => {
            enlarged = false
          },
        })
        enlarged = true
      }
    "
  />
</template>
