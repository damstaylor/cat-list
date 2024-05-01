// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  runtimeConfig: {
    public: {
      API_KEY: process.env.NUXT_API_KEY,
      BASE_URL: process.env.NUXT_BASE_URL || 'https://api.thecatapi.com/v1',
    },
  },
});
