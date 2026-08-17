// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  imports: {
    dirs: [
      // Scans all files directly under app/types
      'types',
      // Optional: Scans nested folders under app/types/
      'types/**',
      'types/**/*.d.ts'
    ],

    
  },
   build: {
    transpile: ['konva']
  }
})