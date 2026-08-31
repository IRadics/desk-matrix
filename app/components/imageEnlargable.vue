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
  <NuxtPicture
    v-else
    :aria-expanded="enlarged"
    :src="src"
    aria-label="Enlarge image"
    class="w-full cursor-pointer"
    @click="
      () => {
        imageDialog({
          src,
          onCloseFn: () => {
            console.log('CLOSED')
            enlarged = false
          },
        })
        enlarged = true
      }
    "
  />
</template>
