// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/seo',
    '@nuxtjs/device',
    '@nuxt/eslint',
    '@nuxt/image',
  ],
  imports: {
    dirs: [
      // Scans all files directly under app/types
      'types',
      // Optional: Scans nested folders under app/types/
      'types/**',
      'types/**/*.d.ts',
    ],
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://deskmatrix.io',
    name: 'DeskMatrix',
    trailingSlash: false,
    description:
      'A multi piece desk mounted solution for MultiBoard, which provides a stable structure, minimized flexing and modularity.',
  },
  colorMode: {
    preference: 'dark',
  },
  build: {
    transpile: ['konva'],
  },
  compatibilityDate: '2025-07-15',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },
  googleFonts: {
    prefetch: true,
    families: {
      'DM Sans': true,
    },
  },
  icon: {
    mode: 'svg',
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons',
      },
    ],
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
  },
  image: {
    format: ['avif', 'webp'],
  },
  ogImage: {
    enabled: false,
  },
  sitemap: {
    zeroRuntime: true,
  },
})
