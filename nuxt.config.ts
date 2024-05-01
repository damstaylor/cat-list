// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  runtimeConfig: {
    public: {
      API_KEY: process.env.API_KEY,
      BASE_URL: process.env.BASE_URL || 'https://api.thecatapi.com/v1',
    },
  },
});
