<script lang="ts">
import {defineComponent} from 'vue';
import '~/assets/css/main.scss';

export default defineComponent({
  name: 'App',
  data() {
    return {
      REQUEST_HEADERS: { 'Content-Type': 'application/json', 'x-api-key': '761e080c-3f90-4fc2-bfb5-bebf6a9c1c16' },
      responseHeaders: null as Record<string, any> | null,
      pictures: [] as any[],
      limit: 9,
      page: 0,
      order: 'Asc',
    };
  },
  mounted() {
    this.getPictures();
  },
  computed: {
    getPaginationCount(): number {
      return this.responseHeaders ? this.responseHeaders['pagination-count'] : 0;
    },
    getNumberOfPages(): number {
      return Math.ceil(this.getPaginationCount / this.limit);
    },
  },
  methods: {
    async getPictures() {
      const url = `https://api.thecatapi.com/v1/images/search?limit=${this.limit}&order=${this.order}&page=${this.page}&has_breeds=1`;
      try {
        const response = await this.makeRequest(url, 'GET');
        if (!Array.isArray(response)) {
          throw new Error('Error: response has the wrong format: ' + response.toString());
        }
        this.pictures = response;
      } catch (e) {
        console.error(e);
      }
    },
    async makeRequest(url: string, method = 'GET') {
      const req = new Request(url, { method, headers: this.REQUEST_HEADERS, mode: 'cors' });
      try {
        const data = await fetch(req);
        this.responseHeaders = { 'pagination-count': Number(data.headers.get('pagination-count')) };
        return data.json();
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    setPage(pageIdx = 0) {
      if (pageIdx < 0) {
        pageIdx = 0;
      }
      this.page = pageIdx;
    },
    increasePage() {
      if (this.page < this.getNumberOfPages - 1) {
        this.page++;
      }
    },
    decreasePage() {
      if (this.page > 0) {
        this.page--;
      }
    },
    setFirstPage() {
      this.setPage(0);
    },
    setLastPage() {
      this.setPage(this.getNumberOfPages - 1);
    },
    setPageValue(newUserPage: number) {
      if (newUserPage < 1) {
        newUserPage = 1;
      } else if (newUserPage > this.getNumberOfPages) {
        newUserPage = this.getNumberOfPages;
      }
      this.setPage(newUserPage - 1);
    },
    setLimit(newPerPageValue: number) {
      this.limit = newPerPageValue;
    },
  },
  watch: {
    page: 'getPictures',
    limit: 'getPictures',
  },
});
</script>

<template>
  <div class="container">
    <h1 class="title">Cats portfolio</h1>
    <Grid :pictures="pictures" :limit="limit" />
    <PaginationNav v-show="pictures.length"
                   :currentPage="page"
                   :total="getPaginationCount"
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
