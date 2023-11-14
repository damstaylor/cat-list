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
      <nav>
        <ul class="pagination">
          <li><a :class="{'disabled': userPage === 1}" @click="setPage(0)">«</a></li>
          <li><a :class="{'disabled': userPage === 1}" @click="decreasePage">&lt;</a></li>
          <li :class="{hidden: getNumberOfPages && userPage < 3}"><span>...</span></li>
          <li :class="{hidden: getNumberOfPages && userPage === 1}"><a @click="decreasePage">{{ userPage - 1 }}</a></li>
          <li class="current-page-indicator"><a>{{ userPage }}</a></li>
          <li :class="{hidden: getNumberOfPages && userPage === getNumberOfPages}"><a @click="increasePage">{{ userPage + 1 }}</a></li>
          <li :class="{hidden: getNumberOfPages && userPage > getNumberOfPages - 2 }"><span>...</span></li>
          <li><a :class="{'disabled': userPage === getNumberOfPages}" @click="increasePage">&gt;</a></li>
          <li><a :class="{'disabled': userPage === getNumberOfPages}" @click="setPage(getNumberOfPages - 1)">»</a></li>
        </ul>
        <div class="go-to-page">
          <label for="go-to-page-input">Go to page:</label>
          <input id="go-to-page-input" type="number" min=1 :max="getNumberOfPages" :value="userPage" @change="onPageNumberInput" >
        </div>
        <div>
          <label for="per-page-select">Images per page:</label>
          <select name="per-page" id="per-page-select" @input="onPerPageInput">
            <option value="4">4</option>
            <option value="9" selected>9</option>
            <option value="16">16</option>
          </select>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script>
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
    userPage() {
      return this.page + 1;
    },
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
    onPageNumberInput(event) {
      let newUserPage = Number(event.target.value);
      if (newUserPage < 1) {
        newUserPage = 1;
      } else if (newUserPage > this.getNumberOfPages) {
        newUserPage = this.getNumberOfPages;
      }
      this.setPage(newUserPage - 1);
    },
    onPerPageInput(event) {
      this.limit = Number(event.target.value);
    },
  },
  watch: {
    page: 'getPictures',
    limit: 'getPictures',
  },
}
</script>

<style>
a:any-link, li a:hover:not(.disabled), .current-page-indicator {
  color: dodgerblue;
}

a:hover {
  cursor: pointer;
}

.hidden {
  visibility: hidden;
}

.disabled {
  color: #555555;
  cursor: default !important;
}

.container {
  color: whitesmoke;
  background-color: rgb(42, 42, 42);
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.pictures {
  display: grid;
  grid-gap: 10px;
  width: 90%;
}

.grid-template-col-4 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-template-col-9 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-template-col-16 {
  grid-template-columns: repeat(4, 1fr);
}

.image-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #555555;
}

.image-container, .image-container img {
  border-radius: .5rem;;
}

.image-container button {
  margin: 10px 0;
}

.image-container img {
  height: 200px;
  max-width: calc(100% - 20px);
  object-fit: contain;
  background-color: rgb(70, 70, 70);
  border: 1px solid whitesmoke;
  margin: 10px;
}

.image-container .picture-info {
  margin-bottom: 10px;
}

.title {
  font-family:
      'Quicksand',
      'Source Sans Pro',
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      'Helvetica Neue',
      Arial,
      sans-serif;
  display: block;
  font-weight: 300;
  font-size: 60px;
  letter-spacing: 1px;
  margin: 70px 0 20px;
}

.title::after {
  content: " \1F43E";
  color: transparent;
  text-shadow: 0 0 0 whitesmoke;
}

footer {
  margin: 20px 0;
}

nav {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.go-to-page {
  margin: 10px 0;
}

.pagination {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  column-gap: 5px;
}

.pagination a {
  width: 30px;
}

.pagination li {
  display: flex;
  align-items: center;
  margin: 0 1px;
}

.pagination li.current-page-indicator {
  border: 1px solid dodgerblue;
  border-radius: .3rem;
  justify-content: center;
}

@media (max-width: 992px) {
  .title {
    font-size: 40px;
  }

  .pictures {
    grid-template-columns: repeat(2, minmax(250px, 1fr));
  }
}

@media (max-width: 720px) {
  .title {
    font-size: 30px;
  }

  .pictures {
    grid-template-columns: repeat(1, minmax(250px, 1fr));
  }
}
</style>
