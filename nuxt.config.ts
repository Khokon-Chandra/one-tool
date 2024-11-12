// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'development' ? process.env.DEV_API_URL : process.env.PROD_API_URL,
      prodBase: process.env.PROD_API_URL
    }
  }

})