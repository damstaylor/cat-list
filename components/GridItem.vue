<script lang="ts">
import {defineComponent} from 'vue';

interface CatData {
  url: string;
  breeds: BreedInfo[];
}

interface BreedInfo {
  name: string;
  origin: string;
  wikipedia_url: string;
}

export default defineComponent({
  name: 'GridItem',
  props: {
    catData: { type: Object as () => CatData, default: () => ({ url: '' }) } as any,
  },
  computed: {
    getBreedInfo(): BreedInfo | null {
      return this.catData?.breeds?.[0] ?? null;
    },
    getBreedName(): string {
      return this.getBreedInfo?.name ?? 'Unknown breed';
    },
    getOrigin(): string {
      return this.getBreedInfo?.origin ?? 'Unknown origin';
    },
    getWikiUrl(): string {
      return this.getBreedInfo?.wikipedia_url ?? '';
    },
  },
});
</script>

<template>
  <div class="image-container">
    <img :src="catData.url || ''" :alt="getBreedName">
    <div class="picture-info">
      <a v-if="getWikiUrl" :href="getWikiUrl" target="_blank">{{ getBreedName }}</a>
      <span v-else>{{ getBreedName }}</span>
      <span> ({{ getOrigin }})</span>
    </div>
  </div>
</template>

<style scoped>
</style>
