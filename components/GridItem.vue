<script lang="ts">
interface CatData {
  name: string;
  country_code: string;
  image: { url: string };
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
    const getBreedName = computed(() => props.catData?.name ?? 'Unknown breed');
    const getOrigin = computed(() => props.catData?.origin ?? 'Unknown origin');
    const getCountryCode = computed(() => props.catData?.country_code ?? '');
    const getFlagUrl = computed(() => `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.2.1/flags/1x1/${getCountryCode.value.toLowerCase()}.svg`);
    const getWikiUrl = computed(() => props.catData?.wikipedia_url ?? '');

    return { getBreedName, getFlagUrl, getOrigin, getWikiUrl };
  },
});
</script>

<template>
  <a class="grid-item" :href="getWikiUrl || '#'" :target="getWikiUrl ? '_blank' : null">
    <div class="image-container">
      <img :src="catData?.image?.url || ''" :alt="getBreedName" class="thumbnail-image">
    </div>
    <div class="picture-info">
      <div class="breed">{{ getBreedName }}</div>
      <div class="origin">
        <img :src="getFlagUrl" :alt="getFlagUrl" /> {{ getOrigin }}
      </div>
    </div>
  </a>
</template>
