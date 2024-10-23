// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  app: {
    head: {
      title: 'Film Hunt - Discover your movie',
      meta: [
        { name: 'description', content: 'Discover your movie here!' }]
    }
  }
})