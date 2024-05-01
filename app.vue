<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import '~/assets/css/main.scss';

export default defineComponent({
  name: 'App',
  setup() {
    const REQUEST_HEADERS = { 'Content-Type': 'application/json', 'x-api-key': '761e080c-3f90-4fc2-bfb5-bebf6a9c1c16' };
    const responseHeaders = ref<Record<string, any> | null>(null);
    const pictures = ref<any[]>([]);
    const limit = ref(9);
    const page = ref(0);
    const order = ref('Asc');

    const paginationCount = computed(() => responseHeaders.value ? responseHeaders.value['pagination-count'] : 0);
    const numberOfPages = computed(() => Math.ceil(paginationCount.value / limit.value));

    const getPictures = async () => {
      const url = `https://api.thecatapi.com/v1/images/search?limit=${limit.value}&order=${order.value}&page=${page.value}&has_breeds=1`;
      try {
        const response = await makeRequest(url, 'GET');
        if (!Array.isArray(response)) {
          throw new Error('Error: response has the wrong format: ' + response.toString());
        }
        pictures.value = response;
      } catch (e) {
        console.error(e);
      }
    };

    const makeRequest = async (url: string, method = 'GET') => {
      const req = new Request(url, { method, headers: REQUEST_HEADERS, mode: 'cors' });
      try {
        const data = await fetch(req);
        responseHeaders.value = { 'pagination-count': Number(data.headers.get('pagination-count')) };
        return data.json();
      } catch (e) {
        console.error(e);
        return e;
      }
    };

    const setPage = (pageIdx = 0) => {
      if (pageIdx < 0) {
        pageIdx = 0;
      }
      page.value = pageIdx;
    };

    const increasePage = () => {
      if (page.value < numberOfPages.value - 1) {
        page.value++;
      }
    };

    const decreasePage = () => {
      if (page.value > 0) {
        page.value--;
      }
    };

    const setFirstPage = () => {
      setPage(0);
    };

    const setLastPage = () => {
      setPage(numberOfPages.value - 1);
    };

    const setPageValue = (newUserPage: number) => {
      if (newUserPage < 1) {
        newUserPage = 1;
      } else if (newUserPage > numberOfPages.value) {
        newUserPage = numberOfPages.value;
      }
      setPage(newUserPage - 1);
    };

    const setLimit = (newPerPageValue: number) => {
      limit.value = newPerPageValue;
    };

    watch([page, limit], () => {
      getPictures();
    });

    onMounted(() => {
      getPictures();
    });

    return {
      pictures,
      limit,
      page,
      paginationCount,
      getPictures,
      makeRequest,
      setPage,
      increasePage,
      decreasePage,
      setFirstPage,
      setLastPage,
      setPageValue,
      setLimit
    };
  }
});
</script>

<template>
  <div class="container">
    <h1 class="title">Cats portfolio</h1>
    <Grid :pictures="pictures" :limit="limit" />
    <PaginationNav v-show="pictures.length"
                   :currentPage="page"
                   :total="paginationCount"
                   :perPage="limit"
                   @click-previous="decreasePage"
                   @click-next="increasePage"
                   @click-start="setFirstPage"
                   @click-end="setLastPage"
                   @page-number-input="setPageValue"
                   @per-page-input="setLimit"
    />
  </div>
</template>
