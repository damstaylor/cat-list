<script lang="ts">
import '~/assets/css/main.scss';

export default defineComponent({
  name: 'App',
  setup() {
    const config = useRuntimeConfig();
    const { API_KEY, BASE_URL } = config.public;
    const REQUEST_HEADERS = {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    };
    const responseHeaders = ref<Record<string, any> | null>(null);
    const pictures = ref<any[]>([]);
    const limit = ref(9);
    const page = ref(0);
    const order = ref('Asc');

    const paginationCount = computed(() => responseHeaders.value ? responseHeaders.value['pagination-count'] : 0);
    const numberOfPages = computed(() => Math.ceil(paginationCount.value / limit.value));

    const getPictures = async () => {
      const url = `${BASE_URL}/breeds?limit=${limit.value}&order=${order.value}&page=${page.value}`;
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
    <h1 class="title">Cat races</h1>
    <Grid :items="pictures" :limit="limit" />
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
