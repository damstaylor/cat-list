<template>
  <div class="container">
    <h1 class="title">Cats portfolio</h1>
    <div class="pictures" :class="'grid-template-col-' + limit">
      <div v-for="(pic, idx) in pictures" :key=idx class="image-container">
        <img :src="pic.url" :alt="getBreedName(pic)">
        <div class="picture-info">
          <a v-if="getWikiUrl(pic)" :href="getWikiUrl(pic)" target="_blank">{{ getBreedName(pic) }}</a>
          <span v-else>{{ getBreedName(pic) }}</span>
          <span> ({{ getOrigin(pic) }})</span>
        </div>
      </div>
    </div>
    <footer>
      <PaginationNav :currentPage="page"
                     :total="getPaginationCount"
                     :perPage="limit"
                     @click-previous="decreasePage"
                     @click-next="increasePage"
                     @click-start="setFirstPage"
                     @click-end="setLastPage"
                     @page-number-input="onPageNumberInput"
                     @per-page-input="onPerPageInput"
      />
    </footer>
  </div>
</template>

<script>
import '~/assets/css/main.scss';

export default {
  data() {
    return {
      REQUEST_HEADERS: { "Content-Type": "application/json", "x-api-key": "761e080c-3f90-4fc2-bfb5-bebf6a9c1c16" },
      responseHeaders: null,
      pictures: [],
      limit: 9,
      page: 0,
      order: "Asc",
    };
  },
  mounted() {
    this.getPictures();
  },
  computed: {
    getPaginationCount() {
      return this.responseHeaders ? this.responseHeaders["pagination-count"] : 0;
    },
    getNumberOfPages() {
      return Math.ceil(this.getPaginationCount / this.limit);
    },
    getBreedObject() {
      return data => data?.breeds?.[0] ?? null;
    },
    getBreedName() {
      return data => {
        return this.getBreedObject(data)?.name ?? "Unknown breed"
      };
    },
    getOrigin() {
      return data => {
        return this.getBreedObject(data)?.origin ?? "Unknown origin";
      };
    },
    getWikiUrl() {
      return data => {
        return this.getBreedObject(data)?.wikipedia_url ?? null;
      };
    },
  },
  methods: {
    getPictures() {
      const url = `https://api.thecatapi.com/v1/images/search?limit=${this.limit}&order=${this.order}&page=${this.page}&has_breeds=1`;
      this.makeRequest(url, "GET").then(response => {
        if (!Array.isArray(response)) {
          throw new Error('Error: response has wrong format: ' + response.toString());
        }
        this.pictures = response;
      }).catch(e => {
        console.error(e);
      });
    },
    makeRequest(url, method = "GET") {
      const req = new Request(url, { method: method, headers: this.REQUEST_HEADERS, mode: "cors" });
      return fetch(req).then(data => {
        this.responseHeaders = { "pagination-count": Number(data.headers.get("pagination-count")) };
        return data.json();
      }).catch(e => {
        console.error(e);
        return e;
      });
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
    onPageNumberInput(newUserPage) {
      if (newUserPage < 1) {
        newUserPage = 1;
      } else if (newUserPage > this.getNumberOfPages) {
        newUserPage = this.getNumberOfPages;
      }
      this.setPage(newUserPage - 1);
    },
    onPerPageInput(newPerPageValue) {
      this.limit = newPerPageValue;
    },
  },
  watch: {
    page: 'getPictures',
    limit: 'getPictures',
  },
}
</script>
