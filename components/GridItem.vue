<script lang="ts">
import { defineComponent, computed } from 'vue';

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
    catData: {
      type: Object as () => CatData,
      default: () => ({ url: '' })
    }
  },
  setup(props) {
    const getBreedInfo = computed(() => props.catData?.breeds?.[0] ?? null);
    const getBreedName = computed(() => getBreedInfo.value?.name ?? 'Unknown breed');
    const getOrigin = computed(() => getBreedInfo.value?.origin ?? 'Unknown origin');
    const getWikiUrl = computed(() => getBreedInfo.value?.wikipedia_url ?? '');

    return { getBreedInfo, getBreedName, getOrigin, getWikiUrl };
  },
});
</script>

<template>
  <a v-if="getWikiUrl" class="grid-item" :href="getWikiUrl" target="_blank">
    <div class="image-container">
      <img :src="catData.url || ''" :alt="getBreedName" class="thumbnail-image">
    </div>
    <div class="picture-info">
      <div>{{ getBreedName }}</div>
      <div class="origin">🌍 {{ getOrigin }}</div>
    </div>
  </a>
</template>
